<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matkul extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_matkul',
        'hari',
        'mulai_jam',
        'akhir_jam',
        'jumlah_pertemuan',
        'jurusan',
        'nip'
    ];
}
