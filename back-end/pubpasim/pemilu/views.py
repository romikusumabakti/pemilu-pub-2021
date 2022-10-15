import base64

from pemilu.serializers import AngkatanSerializer, DapilSerializer, JadwalSerializer, KandidatSerializer, KandidatWithAnggotaSerializer, AnggotaSerializer, SuaraPerAngkatanSerializer, SuaraPerDapilSerializer, UserSerializer
from pemilu.models import Angkatan, Dapil, Jadwal, Kandidat, Anggota, SuaraPerAngkatan, SuaraPerDapil
import pickle
import os
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.conf import settings

from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework_simplejwt.tokens import RefreshToken

import google_auth_oauthlib.flow

from googleapiclient.discovery import build

if settings.DEBUG:
    API_URL = 'http://127.0.0.1:8000'
    FRONTEND_URL = 'http://localhost:3000'
else:
    API_URL = 'https://pemilu-api.pubpasim.org'
    FRONTEND_URL = 'https://pemilu.pubpasim.org'

CLIENT_SECRETS_FILE = 'client_secret.json'

SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
]

REDIRECT_URI = API_URL + '/oauth2callback/'


def authorize(request):

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = REDIRECT_URI

    if request.GET.get('id'):
        anggota = Anggota.objects.filter(nim=request.GET['id'])

        if anggota.exists():

            authorization_url, state = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                state=base64.b64encode(pickle.dumps({
                    'nim': request.GET['id'],
                    'kata_sandi': request.GET['hash'],
                })),
            )

            return redirect(authorization_url)

        else:
            return Response('Anggota tidak ditemukan.', status=status.HTTP_400_BAD_REQUEST)
    else:
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            state=base64.b64encode(pickle.dumps({})),
        )

        return redirect(authorization_url)


def oauth2callback(request):
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    state = pickle.loads(base64.b64decode(request.GET.get('state', None)))
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = REDIRECT_URI

    authorization_response = request.build_absolute_uri()
    flow.fetch_token(authorization_response=authorization_response)

    oauth2 = build('oauth2', 'v2', credentials=flow.credentials)
    user_info = oauth2.userinfo().get().execute()

    akun = User.objects.filter(username=user_info.get('id'))

    if akun.exists():
        auth_login(request, akun.get())
        akun = akun.get()
    else:
        if 'kata_sandi' in state:
            anggota = Anggota.objects.get(nim=state['nim'])
            akun = User.objects.create(
                username=user_info.get('id'),
                first_name=user_info.get('given_name'),
                email=user_info.get('email'),
                password=state['kata_sandi'],
                anggota=anggota,
            )
            if user_info.get('family_name'):
                akun.last_name = user_info.get('family_name')
                akun.save()
            anggota.user = akun
            anggota.foto = user_info.get('picture')
            anggota.save()

        else:
            return redirect(FRONTEND_URL + '/daftar')

    token = RefreshToken.for_user(akun)
    return redirect(FRONTEND_URL + '/?refresh=' + str(token) + '&access=' + str(token.access_token) + '&picture=' + user_info.get('picture'))


class CobaBuatAkun(views.APIView):

    def post(self, request, format=None):
        anggota = Anggota.objects.filter(nim=request.POST['username'])
        if anggota.exists():
            return Response(make_password(request.POST['password']))
        else:
            return Response({'message': 'Anggota telah terdaftar sebagai anggota.'}, status=status.HTTP_400_BAD_REQUEST)


class CobaLogin(views.APIView):

    def post(self, request, format=None):
        akun = User.objects.filter(username=request.POST['nim'])
        if akun.exists():
            return Response()
        else:
            return Response({'message': 'Anggota telah terdaftar sebagai anggota.'}, status=status.HTTP_400_BAD_REQUEST)


class Login(views.APIView):

    def post(self, request, format=None):
        anggota = Anggota.objects.filter(nim=request.POST['username'])
        if anggota.exists():
            akun = User.objects.filter(anggota=anggota.get())
            if akun.exists():
                if akun.get().check_password(request.POST['password']):
                    refresh = RefreshToken.for_user(akun.get())

                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    return Response({'message': 'Kata sandi salah.'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({'message': 'Anggota belum terdaftar.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'NIM/NIDN tidak valid.'}, status=status.HTTP_400_BAD_REQUEST)


class Pilih(views.APIView):

    def post(self, request, format=None):
        kandidat = Kandidat.objects.get(nomor=request.POST['pilihan'])
        if kandidat.palsu:
            if request.POST.get('pilihan_batal'):
                kandidat_batal = Kandidat.objects.get(
                    nomor=request.POST['pilihan_batal'])
                kandidat_batal.suara -= 1
                kandidat_batal.save()
            kandidat.suara += 1
            kandidat.save()
            return Response('Berhasil memilih kandidat palsu: ' + str(kandidat.nomor) + ' ' + str(kandidat.anggota.nama))
        else:
            anggota = self.request.user.anggota
            if anggota.sudah_memilih:
                return Response('Anda sudah menggunakan hak pilih Anda.', status=status.HTTP_400_BAD_REQUEST)
            else:
                kandidat.suara += anggota.hak_suara
                kandidat.save()

                suara_per_dapil = SuaraPerDapil.objects.get(kandidat=kandidat, dapil=anggota.dapil)
                suara_per_dapil.suara += anggota.hak_suara
                suara_per_dapil.save()

                suara_per_angkatan = SuaraPerAngkatan.objects.get(kandidat=kandidat, angkatan=anggota.angkatan)
                suara_per_angkatan.suara += anggota.hak_suara
                suara_per_angkatan.save()

                anggota.sudah_memilih = True
                anggota.save()
                return Response('Berhasil memilih.')


class DaftarAnggota(generics.ListAPIView):
    queryset = Anggota.objects.all()
    serializer_class = AnggotaSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = AnggotaSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarDapil(generics.ListAPIView):
    queryset = Dapil.objects.all()
    serializer_class = DapilSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = DapilSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarAngkatan(generics.ListAPIView):
    queryset = Angkatan.objects.all()
    serializer_class = AngkatanSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = AngkatanSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarJadwal(generics.ListAPIView):
    queryset = Jadwal.objects.all()
    serializer_class = JadwalSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = JadwalSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarKandidat(generics.ListAPIView):
    queryset = Kandidat.objects.filter(palsu=False)
    serializer_class = KandidatWithAnggotaSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = KandidatWithAnggotaSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarKandidatPalsu(generics.ListAPIView):
    queryset = Kandidat.objects.filter(palsu=True)
    serializer_class = KandidatWithAnggotaSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = KandidatWithAnggotaSerializer(queryset, many=True)
        return Response(serializer.data)


class StatistikPendaftaran(views.APIView):

    def get(self, request):
        sudah = Anggota.objects.exclude(akun=None).count()
        belum = Anggota.objects.filter(akun=None).count()
        return Response({
            'sudah': sudah,
            'belum': belum,
        })


class StatistikAnggotaan(views.APIView):

    def get(self, request):
        sudah = Anggota.objects.filter(sudah_memilih=True).count()
        belum = Anggota.objects.exclude(akun=None).filter(sudah_memilih=False).count()
        return Response({
            'sudah': sudah,
            'belum': belum,
        })


class DaftarSuaraPerDapil(generics.ListAPIView):
    queryset = SuaraPerDapil.objects.all()
    serializer_class = SuaraPerDapilSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SuaraPerDapilSerializer(queryset, many=True)
        return Response(serializer.data)


class DaftarSuaraPerAngkatan(generics.ListAPIView):
    queryset = SuaraPerAngkatan.objects.all()
    serializer_class = SuaraPerAngkatanSerializer

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = SuaraPerAngkatanSerializer(queryset, many=True)
        return Response(serializer.data)


class AkunLogin(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)

class AdminLogin(views.APIView):

    def post(self, request, format=None):
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

class KandidatList(generics.ListCreateAPIView):
    queryset = Kandidat.objects.all()
    serializer_class = KandidatSerializer
    permission_classes = [IsAdminUser]

class KandidatView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'nomor'
    queryset = Kandidat.objects.all()
    serializer_class = KandidatSerializer
    permission_classes = [IsAdminUser]

class AnggotaList(generics.ListCreateAPIView):
    queryset = Anggota.objects.all()
    serializer_class = AnggotaSerializer
    permission_classes = [IsAdminUser]

class AnggotaView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'nim'
    queryset = Anggota.objects.all()
    serializer_class = AnggotaSerializer
    permission_classes = [IsAdminUser]

class DapilList(generics.ListCreateAPIView):
    queryset = Dapil.objects.all()
    serializer_class = DapilSerializer
    permission_classes = [IsAdminUser]

class DapilView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    queryset = Dapil.objects.all()
    serializer_class = DapilSerializer
    permission_classes = [IsAdminUser]

class AngkatanList(generics.ListCreateAPIView):
    queryset = Angkatan.objects.all()
    serializer_class = AngkatanSerializer
    permission_classes = [IsAdminUser]

class AngkatanView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'nomor'
    queryset = Angkatan.objects.all()
    serializer_class = AngkatanSerializer
    permission_classes = [IsAdminUser]