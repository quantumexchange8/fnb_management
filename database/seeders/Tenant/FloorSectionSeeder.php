<?php

namespace Database\Seeders\Tenant;

use App\Models\Tenant\FloorTable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FloorSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $layout = [
            ["x" => 480, "y" => 160, "pax" => 2, "color" => "#FCFCFC", "label" => "T01", "width" => 75, "height" => 75, "table_id" => "T01"],
            ["x" => 200, "y" => 160, "pax" => 2, "color" => "#FCFCFC", "label" => "T02", "width" => 75, "height" => 75, "table_id" => "T02"],
            ["x" => 200, "y" => 360, "pax" => 2, "color" => "#FCFCFC", "label" => "T03", "width" => 75, "height" => 75, "table_id" => "T03"],
            ["x" => 480, "y" => 360, "pax" => 2, "color" => "#FCFCFC", "label" => "T04", "width" => 75, "height" => 75, "table_id" => "T04"],
        ];


        DB::table('table_layouts')->insert([
            'name' => '1st floor',
            'layout_json' => json_encode($layout),
            'floor' => '1',
        ]);


        foreach ($layout as $shape) {
            FloorTable::create([
                'table_layout_id'   => 1,
                'table_name'        => $shape['label'],
                'table_id'          => $shape['table_id'],
                'pax'               => $shape['pax'],
                'status'            => 'available',
                'current_order_id'  => null,
            ]);
        }
    }
}
