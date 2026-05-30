from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    TIPO_CHOICES = [
        ('comprador', 'Comprador'),
        ('vendedor', 'Vendedor'),
    ]
    
    tipo_usuario = models.CharField(
        max_length=15, 
        choices=TIPO_CHOICES, 
        default='comprador'
    )

    def __str__(self):
        return f"{self.username} ({self.get_tipo_usuario_display()})"