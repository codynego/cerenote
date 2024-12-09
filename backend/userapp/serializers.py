from rest_framework.serializers import ModelSerializer
from .models import User

class UserSerializer(ModelSerializer):
    """
    Serializer for retrieving user details.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'created_at']
        read_only_fields = ['created_at']


class UserCreateSerializer(ModelSerializer):
    """
    Serializer for creating new users.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Override the create method to use the create_user method,
        ensuring the password is hashed and the user is created correctly.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

