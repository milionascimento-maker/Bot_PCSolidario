from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaListView(APIView):
    def get(self, request):
        # Busca todas as categorias salvas no banco de dados
        categorias = Categoria.objects.all()
        # Passa as categorias pelo tradutor (many=True indica que é uma lista de objetos)
        serializer = CategoriaSerializer(categorias, many=True)
        # Devolve a lista traduzida em JSON para o front-end
        return Response(serializer.data)