from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CadastroUsuarioSerializer

class CadastroUsuarioView(APIView):
    def post(self, request):
        # Passa os dados que o front enviou para o tradutor (Serializer)
        serializer = CadastroUsuarioSerializer(data=request.data)
        
        # Se os dados forem válidos (e-mail correto, campos preenchidos)
        if serializer.is_valid():
            serializer.save() # Salva no banco de dados!
            return Response(
                {"mensagem": "Usuário criado com sucesso!"}, 
                status=status.HTTP_201_CREATED
            )
        
        # Se der erro (ex: e-mail repetido), devolve o erro para o front
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)