from django.urls import path
from .views import ProductListView, UserListView, UserDetailView, recommend_product, signup, login
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('recommend/', recommend_product, name='recommend-product'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
