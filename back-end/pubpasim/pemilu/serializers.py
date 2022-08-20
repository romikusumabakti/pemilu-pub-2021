from pemilu.models import Angkatan, Dapil, Jadwal, Kandidat, Anggota, SuaraPerAngkatan, SuaraPerDapil
from django.contrib.auth.models import User
from rest_framework import serializers

class DapilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dapil
        fields = '__all__'

class AngkatanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Angkatan
        fields = '__all__'

class AnggotaSerializer(serializers.ModelSerializer):
    # dapil = DapilSerializer()
    # angkatan = AngkatanSerializer()
    class Meta:
        model = Anggota
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    anggota = AnggotaSerializer()
    class Meta:
        model = User
        fields = '__all__'

class JadwalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jadwal
        fields = '__all__'

class SuaraPerDapilSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuaraPerDapil
        fields = '__all__'

class SuaraPerAngkatanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuaraPerAngkatan
        fields = '__all__'

class KandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kandidat
        fields = '__all__'

class KandidatWithAnggotaSerializer(serializers.ModelSerializer):
    anggota = AnggotaSerializer()
    class Meta:
        model = Kandidat
        fields = '__all__'

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

class BuatAkunSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password', 'anggota']
    
    def create(self, validated_data):
        anggota = validated_data['anggota']
        user = User.objects.create_user(
            username=validated_data['anggota'].nim,
            password=validated_data['password'],
            anggota=validated_data['anggota'],
        )
        anggota.user = user
        anggota.save()
        return user