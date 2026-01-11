<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $totalStudetn = Student::Count();
        return Inertia::render('dashboard',[
            'totalStudent'=> $totalStudetn,
        ]);
    }
}
