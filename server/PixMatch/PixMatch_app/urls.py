from django.contrib import admin
from django.urls import path
from .views import ProductListView, ProductDetailView, ProductByCategoryView, SearchProductView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/category/<str:category>/', ProductByCategoryView.as_view(), name='product-by-category'),
    path('products/search/', SearchProductView.as_view(), name='search-product'),
    
]
