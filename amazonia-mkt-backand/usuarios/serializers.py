from rest_framework import serializers
from .models import Usuario

class CadastroUsuarioSerializer(serializers.ModelSerializer):
    nome_completo = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['nome_completo', 'email', 'password', 'tipo_usuario']

    def create(self, validated_data):
        # Como o Django padrão exige um 'username', vamos usar o próprio e-mail do usuário para isso
        usuario = Usuario.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['nome_completo'],
            tipo_usuario=validated_data.get('tipo_usuario', 'comprador')
        )
        return usuario