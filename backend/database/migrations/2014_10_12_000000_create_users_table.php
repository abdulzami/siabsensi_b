<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique()->nullable();
            $table->string('nip')->unique()->nullable();
            $table->string('name');
            $table->enum('jenis_kelamin',['L','P']);
            $table->string('alamat',500);
            $table->string('no_hp',14);
            $table->enum('level',['Mahasiswa','Dosen','Admin']);
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
