from django.urls import path
from .views import CategoriaListView

urlpatterns = [
    path('categorias/', CategoriaListView.as_view(), name='lista-categorias'),
]