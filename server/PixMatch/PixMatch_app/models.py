from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    liked_categories = models.JSONField(default=list, blank=True)  # List of preferred categories

    # Override the groups and user_permissions to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='pixmatch_users',  # Changed from pixmatch_user_set
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='pixmatch_users',  # Changed from pixmatch_user_set
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'pixmatch_user'  # Custom table name
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='product_images/')
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']