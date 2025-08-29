<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Transaction;
use App\Models\Tenant\Wallet;
use App\Models\User;
use Carbon\Carbon;
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

        $user = User::where('uid', $uid)->with(['rank', 'upline'])->first();

        $cashWallet = Wallet::where('type', 'cash_wallet')->where('user_id', $user->id)->first();
        $dineWallet = Wallet::where('type', 'dine_in_wallet')->where('user_id', $user->id)->first();

        $transaction = Transaction::where('user_id', $user->id)->with(['user:id,name'])->get();


        return Inertia::render('Tenant/Member/EditMember', [
            'user' => $user,
            'cashWallet' => $cashWallet,
            'dineWallet' => $dineWallet,
            'transaction' => $transaction,
        ]);

    }

    public function updateMemberStatus(Request $request)
    {
        $request->validate([
            'status' => [
                'required',
            ],
        ]);
        
        $user = User::find($request->id); 
        $user->update([
            'status' => $request->status ? '0' : '1',
            
        ]);
        return redirect()->back();
    }

    public function updateMemberProfile(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',  
            ],            
        ]);
        
        $user = User::find($request->id);
        $dob = Carbon::parse($request->dob);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'dob' => $dob,
            'gender' => $request->gender,
            'member_id' => $request->member_id,
            'address1' => $request->address1,
            'address2' => $request->address2,
            'address3' => $request->address3,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
        ]);


        return redirect()->back();
    }
}
