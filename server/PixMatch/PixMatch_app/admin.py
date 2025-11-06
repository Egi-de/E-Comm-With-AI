from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    def log_deletions(self, request, queryset):
        # Override to disable logging deletions to avoid foreign key issues
        pass

# Register your models here.
admin.site.register(Product, ProductAdmin)
