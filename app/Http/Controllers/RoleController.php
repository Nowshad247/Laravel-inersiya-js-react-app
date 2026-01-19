<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $roles = Role::all()->map(function ($role) {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ];
       });

    
       return inertia('role/index', [
        'roles' => $roles,
       ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permitons = Permission::all();
        return inertia('role/create',[
            'permissions'=>$permitons
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $request->validate([
        'name'=>'required|unique:roles,name',
        'guard_name'=>'required',
        'permissions'=>'array'
       ]);
         $role = Role::create([
          'name'=>$request->name,
          'guard_name'=>$request->guard_name
         ]);
            if($request->has('permissions')){
                $role->syncPermissions($request->permissions);
            }   
        return Inertia::location(route('users.permissions'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::findById($id);
        $permissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('id')->toArray();
        return inertia('role/edit',[
            'role'=>$role,
            'permissions'=>$permissions,
            'rolePermissions'=>$rolePermissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
