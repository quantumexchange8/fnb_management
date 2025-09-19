<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\FloorSection;
use App\Models\Tenant\FloorTable;
use App\Models\Tenant\TableLayout;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableLayoutController extends Controller
{
    public function tableLayout()
    {

        $floors = TableLayout::orderBy('order_no')->get();

        return Inertia::render('Tenant/Configurations/TableLayout', [
            'floors' => $floors,
        ]);
    }

    public function editTableLayout()
    {

        $floors = TableLayout::orderBy('order_no')->get();

        return Inertia::render('Tenant/Configurations/EditTableLayout', [
            'floors' => $floors,
        ]);
    }

    public function getFloorPlans(Request $request)
    {

        $query = TableLayout::orderBy('order_no');

        if ($request->has('selectedFloor')) {
            $selectedFloor = $request->get('selectedFloor');
            $query->where('id', $selectedFloor);
        }

        $floorPlan = $query->first();

        return response()->json(json_decode($floorPlan->layout_json, true));
    }


    public function updateManageSection(Request $request)
    {

        $layout = [
            ["x" => 480, "y" => 160, "pax" => 2, "color" => "#FCFCFC", "label" => "T01", "width" => 75, "height" => 75, "table_id" => "T01"],
            ["x" => 200, "y" => 160, "pax" => 2, "color" => "#FCFCFC", "label" => "T02", "width" => 75, "height" => 75, "table_id" => "T02"],
            ["x" => 200, "y" => 360, "pax" => 2, "color" => "#FCFCFC", "label" => "T03", "width" => 75, "height" => 75, "table_id" => "T03"],
            ["x" => 480, "y" => 360, "pax" => 2, "color" => "#FCFCFC", "label" => "T04", "width" => 75, "height" => 75, "table_id" => "T04"],
        ];

        if (!empty($request->removedFloor)) {
            foreach ($request->removedFloor as $remove) {
                $existingFloor = TableLayout::find($remove);

                if ($existingFloor) {

                    $floorTables = FloorTable::where('table_layout_id', $existingFloor)->get();

                    if (!empty($floorTables)) {
                        $inUse = $floorTables->contains(function ($table) {
                            return $table->status !== 'available' || $table->current_order_id !== null;
                        });
    
                        if ($inUse) {
                            return response()->json([
                                'message' => 'Cannot delete floor, some tables are in use.'
                            ], 409); // conflict
                        } else {
                            foreach ($floorTables as $table) {
                                $table->delete();
                            }

                            $existingFloor->delete();
                        }
                    }
                }
            }
        }

        // Loop through submitted floors
        foreach ($request->floors as $floor) {
            $existingFloor = TableLayout::find($floor['id']);

            if ($existingFloor) {
                $existingFloor->update([
                    'name' => $floor['name'],
                    'order_no' => $floor['order_no'],
                ]);
            } else {
                $tableLayout = TableLayout::create([
                    'name' => $floor['name'],
                    'order_no' => $floor['order_no'],
                    'layout_json' => json_encode($layout),
                    'available_color' => '#fcfcfc',
                    'in_use_color' => '#fcfcfc',
                    'reserved_color' => '#fcfcfc',
                ]);

                // Create default tables for this floor
                foreach ($layout as $table) {
                    FloorTable::create([
                        'table_layout_id' => $tableLayout->id,
                        'table_id' => $table['table_id'],
                        'table_name' => $table['label'],
                        'pax' => $table['pax'],
                        'status' => 'available',
                        'current_order_id' => null,
                        'available_color' => $table['color'],
                        'in_use_color' => $table['color'],
                        'reserved_color' => $table['color'],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'store succeful'
        ], 200);
    }

    public function storeTableLayout(Request $request)
    {

        // dd($request->all());

        $request->validate([
            'shapes' => ['required'],
        ]);

        $findExistingFloor = TableLayout::find($request->floor);

        if ($findExistingFloor) {

            $available_color = '#fcfcfc';
            $in_use_color = '#fcfcfc';
            $reserved_color = '#fcfcfc';

            foreach ($request->shapes as $table) {
                $available_color = $table['color'];
                $in_use_color = $table['secondary_color'];
                $reserved_color = $table['tertiary_color'];
            }

            $findExistingFloor->update([
                'layout_json' => json_encode($request->shapes),
                'available_color' => $available_color,
                'in_use_color' => $in_use_color,
                'reserved_color' => $reserved_color,
            ]);
        }

        if (!empty($request->removedTable)) {
            foreach ($request->removedTable as $remove) {
                $findTable = FloorTable::where('table_id', $remove)->first();

                $findTable->delete();
            }
        }

        foreach ($request->shapes as $table) {

            $findExistingTable = FloorTable::where('table_layout_id', $findExistingFloor->id)->where('table_id', $table['table_id'])->first();

            if ($findExistingTable) {
                $findExistingTable->update([
                    'table_name' => $table['label'],
                    'pax' => $table['pax'],
                    'available_color' => $table['color'],
                    'in_use_color' => $table['secondary_color'],
                    'reserved_color' => $table['tertiary_color'],
                ]);
            } else {
                $floorTable = FloorTable::create([
                    'table_layout_id' => $findExistingFloor->id,
                    'table_id' => $table['table_id'],
                    'table_name' => $table['label'],
                    'pax' => $table['pax'],
                    'status' => 'available',
                    'current_order_id' => null,
                    'available_color' => $table['color'],
                    'in_use_color' => $table['secondary_color'],
                    'reserved_color' => $table['tertiary_color'],
                ]);
            }

        }

        return redirect()->back();
    }
}
