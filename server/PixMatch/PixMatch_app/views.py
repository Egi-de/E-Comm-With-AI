from django.shortcuts import render
from .models import Product, User
from .serializers import ProductSerializer, UserSerializer, UserRegistrationSerializer, UserLoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.conf import settings
import json
import base64
from django.db import models
import re


# Create your views here.

@api_view(['POST'])

def recommend_product(request):
    image = request.FILES.get('image')
    if not image:
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Use Gemini 2.0 Flash with vision capabilities
    api_key = "AIzaSyAzyr6Flu29_YnyOjl-3sPbhJLVTseY_Kk"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"

    headers = {"Content-Type": "application/json"}

    # Read and encode the image
    try:
        image_data = image.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
    except Exception as e:
        return Response(
            {"error": f"Failed to process image: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Enhanced prompt for fashion recommendations
    prompt = """Analyze this fashion item or clothing image and recommend 6-8 similar products that someone might buy online.

For each recommendation, provide:
- Product name (be specific and appealing, include brand-style names)
- Brief description (2-3 sentences highlighting key features, materials, and style)
- Category (e.g., shirt, dress, shoes, accessories, pants, jacket, sweater, etc.)
- Estimated price range (realistic for current market, format: $XX.XX - $XX.XX)
- Style tags (3-4 relevant tags like casual, formal, trendy, classic, modern, vintage, minimalist, etc.)

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Product Name",
    "description": "Brief description of the product",
    "category": "product_category",
    "price": "$XX.XX - $XX.XX",
    "style_tags": ["tag1", "tag2", "tag3"]
  }
]

CRITICAL: Return ONLY the JSON array. No markdown, no code blocks, no explanatory text before or after."""

    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": image.content_type or "image/jpeg",
                            "data": encoded_image
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.8,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 4096,
        }
    }

    try:
        # Make request to Gemini API
        print("Sending request to Gemini API...")
        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        gemini_response = response.json()

        # Extract the text response from Gemini
        try:
            response_text = gemini_response['candidates'][0]['content']['parts'][0]['text']
            print(f"Gemini raw response (first 500 chars): {response_text[:500]}")
        except (KeyError, IndexError) as e:
            print(f"Error extracting Gemini response: {e}")
            print(f"Full response: {json.dumps(gemini_response, indent=2)}")
            return Response(
                {"error": "Invalid response structure from Gemini API"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Clean the response text
        response_text = response_text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        elif response_text.startswith('```'):
            response_text = response_text[3:]
        
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()

        # Try to find JSON array in the response
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(0)
        
        try:
            # Parse the JSON
            recommendations = json.loads(response_text)

            # Validate the structure
            if not isinstance(recommendations, list):
                raise ValueError("Response is not a list")
            
            if len(recommendations) == 0:
                return Response(
                    {"error": "Gemini did not return any recommendations. The image might not contain recognizable fashion items."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate and clean each recommendation
            valid_recommendations = []
            for idx, rec in enumerate(recommendations):
                # Check required fields
                required_fields = ['name', 'description', 'category', 'price', 'style_tags']
                missing_fields = [field for field in required_fields if field not in rec]
                
                if missing_fields:
                    print(f"Recommendation {idx} missing fields: {missing_fields}")
                    continue
                
                # Ensure style_tags is a list
                if not isinstance(rec.get('style_tags'), list):
                    rec['style_tags'] = []
                
                # Add additional fields for frontend compatibility
                rec['id'] = idx + 1
                rec['image'] = None
                rec['created_at'] = None
                
                valid_recommendations.append(rec)

            if len(valid_recommendations) == 0:
                return Response(
                    {"error": "No valid recommendations found in Gemini response"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            print(f"Successfully processed {len(valid_recommendations)} recommendations from Gemini")
            return Response(valid_recommendations, status=status.HTTP_200_OK)

        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Attempted to parse: {response_text[:500]}")
            return Response(
                {"error": "Failed to parse Gemini response. Please try again with a clearer image."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValueError as e:
            print(f"Validation error: {e}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except requests.Timeout:
        print("Gemini API timeout")
        return Response(
            {"error": "Request to Gemini API timed out. Please try again."}, 
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )
    except requests.RequestException as e:
        print(f"Gemini API request error: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Error response: {e.response.text}")
        return Response(
            {"error": f"Failed to connect to Gemini API: {str(e)}"}, 
            status=status.HTTP_502_BAD_GATEWAY
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": f"Internal server error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserDetailView(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def signup(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data.get('user')
        if user:
            refresh = RefreshToken.for_user(user)
            tokens = {'refresh': str(refresh), 'access': str(refresh.access_token)}
            return Response({'user': UserSerializer(user).data, 'tokens': tokens}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)