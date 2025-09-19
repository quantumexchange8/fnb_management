<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tax_settings')->insert([
            'name' => 'sst',
            'type' => 'sst',
            'percentage' => 6,
        ]);

        DB::table('tax_settings')->insert([
            'name' => 'Service Charge',
            'type' => 'service_charge',
            'percentage' => 0,
        ]);
    }
}
