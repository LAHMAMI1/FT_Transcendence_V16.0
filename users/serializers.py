from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)
    middle_name = serializers.CharField(max_length=30, required=False)
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'middle_name', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        # Use create_user to automatically hash the password
        return User.objects.create_user(**validated_data)