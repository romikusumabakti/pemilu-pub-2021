"""pubpasim URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from pemilu import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('admin/login/', views.AdminLogin.as_view(), name='admin_login'),

    path('admin/kandidat/', views.KandidatList.as_view(), name='admin_kandidat_list'),
    path('admin/kandidat/<nomor>/', views.Kandidat.as_view(), name='admin_kandidat'),

    path('admin/anggota/', views.AnggotaList.as_view(), name='admin_anggota_list'),
    path('admin/anggota/<nim>/', views.Anggota.as_view(), name='admin_anggota'),

    path('admin/dapil/', views.DapilList.as_view(), name='admin_dapil_list'),
    path('admin/dapil/<id>/', views.Dapil.as_view(), name='admin_dapil'),

    path('admin/angkatan/', views.AngkatanList.as_view(), name='admin_angkatan_list'),
    path('admin/angkatan/<nomor>/', views.Angkatan.as_view(), name='admin_angkatan'),

    path('authorize/', views.authorize, name='authorize'),
    path('oauth2callback/', views.oauth2callback, name='oauth2callback'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('coba_buat_akun/', views.CobaBuatAkun.as_view(), name='coba_buat_akun'),
    path('login/', views.Login.as_view(), name='login'),
    path('akun_login/', views.AkunLogin.as_view(), name='akun_login'),

    path('anggota/', views.DaftarAnggota.as_view(), name='anggota'),
    path('angkatan/', views.DaftarAngkatan.as_view(), name='angkatan'),
    path('jadwal/', views.DaftarJadwal.as_view(), name='jadwal'),

    path('kandidat/', views.DaftarKandidat.as_view(), name='kandidat'),
    path('simulasi/kandidat/', views.DaftarKandidatPalsu.as_view(), name='kandidat_palsu'),
    path('dapil/', views.DaftarDapil.as_view(), name='dapil'),
    path('pilih/', views.Pilih.as_view(), name='pilih'),
    path('statistik/pendaftaran/', views.StatistikPendaftaran.as_view(), name='statistik_pendaftaran'),
    path('statistik/anggotaan/', views.StatistikAnggotaan.as_view(), name='statistik_anggotaan'),
    path('statistik/suara_per_dapil/', views.DaftarSuaraPerDapil.as_view(), name='suara_per_dapil'),
    path('statistik/suara_per_angkatan/', views.DaftarSuaraPerAngkatan.as_view(), name='suara_per_angkatan'),
]
