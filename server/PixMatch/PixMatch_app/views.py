from django.shortcuts import render
import requests

# Create your views here.
from rest_framework import APIView
from rest_framework.decorators import api_view
from .models import products
from .serializers import ProductSerializer
from rest_framework.response import Response

@api_view(['POST'])
def recommend_products(request):
    image = request.FILES.get('image')
    prompt = "find similar products to this image"
    
    headers = {
        'Authorization': f'Bearer AIzaSyAOrY_t8D0nuO-1WB88lptWXqoQJUAC0WE' 
    }
    files = {"file": image}
    resp = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
        headers=headers,
        files=files,
        data={"prompt": prompt},
    )
    return Response(resp.json())
    


class ProductListView(APIView):
    def get(self, request):
        products_list = products.objects.all()
        serializer = ProductSerializer(products_list, many=True)
        return Response(serializer.data)
    
    
class ProductDetailView(APIView):
    def get(self, request, pk):
        try:
            product = products.objects.get(pk=pk)
        except products.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
class ProductByCategoryView(APIView):
    def get(self, request, category):
        products_list = products.objects.filter(category=category)
        serializer = ProductSerializer(products_list, many=True)
        return Response(serializer.data)
    
class SearchProductView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        products_list = products.objects.filter(name__icontains=query)
        serializer = ProductSerializer(products_list, many=True)
        return Response(serializer.data)
    
    
    


   



    
    
    