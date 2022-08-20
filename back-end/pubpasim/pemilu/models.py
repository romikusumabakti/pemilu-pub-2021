from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import DateField

class Dapil(models.Model):
    nama = models.CharField(max_length=255)

class Angkatan(models.Model):
    nomor = models.IntegerField(primary_key=True)
    nama = models.CharField(max_length=255)

class Anggota(models.Model):
    nim = models.CharField(max_length=12, primary_key=True)
    nama = models.CharField(max_length=255)
    dapil = models.ForeignKey(Dapil, on_delete=models.CASCADE)
    angkatan = models.ForeignKey(Angkatan, null=True, on_delete=models.SET_NULL)
    akun = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)
    hak_suara = models.IntegerField(default=1)
    sudah_memilih = models.BooleanField(default=False)
    foto = models.CharField(max_length=255, null=True)

class Jadwal(models.Model):
    tanggal_mulai = DateField()
    tanggal_berakhir = DateField(null=True)
    kegiatan = models.CharField(max_length=255)

class Kandidat(models.Model):
    palsu = models.BooleanField(default=False)
    nomor = models.IntegerField(primary_key=True)
    anggota = models.ForeignKey(Anggota, on_delete=models.CASCADE)
    foto = models.CharField(max_length=255, null=True)
    warna = models.CharField(max_length=255)
    visi = models.CharField(max_length=255)
    suara = models.IntegerField(default=0)

class Misi(models.Model):
    kandidat = models.ForeignKey(Kandidat, on_delete=models.CASCADE)
    isi = models.CharField(max_length=255)

class SuaraPerDapil(models.Model):
    kandidat = models.ForeignKey(Kandidat, on_delete=models.CASCADE)
    dapil = models.ForeignKey(Dapil, on_delete=models.CASCADE)
    suara = models.IntegerField(default=0)

class SuaraPerAngkatan(models.Model):
    kandidat = models.ForeignKey(Kandidat, on_delete=models.CASCADE)
    angkatan = models.ForeignKey(Angkatan, on_delete=models.CASCADE)
    suara = models.IntegerField(default=0)