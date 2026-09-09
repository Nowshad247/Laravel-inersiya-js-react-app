<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EmployeesAttendanceController extends Controller
{
    /**
     * Display the Employees Attendance page.
     */
    public function index()
    {
        return Inertia::render('employees-attendance/index');
    }
}
