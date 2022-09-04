<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'The Admin',
            'jenis_kelamin' => 'L',
            'alamat' => 'Server',
            'no_hp' => '010101010',
            'level' => 'Admin',
            'jurusan' => '-',
            'email' => 'admin@administrator.com',
            'password' => Hash::make('admin')
        ]);
    }
}
