<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RunningNumber extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('running_numbers')->insert([
            'type' => 'cash_wallet',
            'prefix' => 'CW',
            'digits' => '8',
            'last_number' => '0',
        ]);

        DB::table('running_numbers')->insert([
            'type' => 'dine_in_wallet',
            'prefix' => 'DIW',
            'digits' => '8',
            'last_number' => '0',
        ]);

        DB::table('running_numbers')->insert([
            'type' => 'shift',
            'prefix' => 'S',
            'digits' => '8',
            'last_number' => '0',
        ]);

        DB::table('running_numbers')->insert([
            'type' => 'modifier_group',
            'prefix' => 'MG',
            'digits' => '4',
            'last_number' => '0',
        ]);

        DB::table('running_numbers')->insert([
            'type' => 'member_uid',
            'prefix' => 'N2UM',
            'digits' => '8',
            'last_number' => '0',
        ]);

        DB::table('running_numbers')->insert([
            'type' => 'order_no',
            'prefix' => '#',
            'digits' => '10',
            'last_number' => '0',
        ]);
    }
}
