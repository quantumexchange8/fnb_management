<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function memberListing()
    {

        return Inertia::render('Tenant/Member/MemberListing');
    }

    public function getMembers(Request $request)
    {
        
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = User::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $members = $query->paginate($perPage);

        return response()->json([
            'data' => $members->items(),
            'total' => $members->total(),
            'current_page' => $members->currentPage(),
            'last_page' => $members->lastPage(),
        ]);
    }

    public function editMember($uid)
    {

        $user = User::where('uid', $uid)->first();

        return Inertia::render('Tenant/Member/EditMember', [
            'user' => $user,
        ]);

    }
}
