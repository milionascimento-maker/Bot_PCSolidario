from django.urls import path
from .views import CadastroUsuarioView

urlpatterns = [
    path('cadastro/', CadastroUsuarioView.as_view(), name='cadastro-usuario'),
]