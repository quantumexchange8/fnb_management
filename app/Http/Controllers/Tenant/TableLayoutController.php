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

        if (!empty($request->removedFloor)) {
            foreach ($request->removedFloor as $remove) {
                $existingFloor = TableLayout::find($remove);

                if ($existingFloor) {
                    $existingFloor->delete();
                }
            }
        }

        foreach ($request->floors as $floor) {
            $existingFloor = TableLayout::find($floor['id']);

            if ($existingFloor) {
                $existingFloor->update([
                    'name' => $floor['name'],
                    'order_no' => $floor['order_no'],
                ]);
            } else {
                TableLayout::create([
                    'name' => $floor['name'],
                    'order_no' => $floor['order_no'],
                ]);
            }
        }

        return response()->json([
            'message' => 'store succeful'
        ], 200);
    }

    public function storeTableLayout(Request $request)
    {

        // dd($request->all());

        $findExistingFloor = TableLayout::find($request->floor);

        if ($findExistingFloor) {
            $findExistingFloor->update([
                'layout_json' => json_encode($request->shapes),
            ]);
        }

        if (!empty($request->removedTable)) {
            foreach ($request->removedTable as $remove) {
                $findTable = FloorTable::where('table_id', $remove)->first();

                $findTable->delete();
            }
        }

        foreach ($request->shapes as $table) {

            $findExistingTable = FloorTable::where('table_id', $table['table_id'])->first();

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
