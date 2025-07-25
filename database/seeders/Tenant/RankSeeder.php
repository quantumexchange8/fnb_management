<?php

namespace Database\Seeders\Tenant;

use App\Models\Ranking;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rankings')->insert([
            'name' => 'normal',
            'min_amount' => '0.00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('rankings')->insert([
            'name' => 'VIP',
            'min_amount' => '0.00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
