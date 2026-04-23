<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Lead;
use App\Models\Student;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStudetn = Student::count();
        $totalBatch = Batch::count();
        $totalCourses = Course::count();
        $totalleads = Lead::count();

        $ActiveCalls = 0;
        $ConversionRate = '0%';
        $Follow_ups_Today = 0;

        $batches = Batch::query()
            ->select([
                'id',
                'name',
                'course_id',
                'batch_code',
                'start_date',
                'end_date',
                'TotalClass',
                'batch_status',
            ])
            ->with([
                'course:id,name',
                'batchDetail:id,batch_id,total_classes',
            ])
            ->where('start_date', '>', now())
            ->orWhere('batch_status', '=', 'upcoming')
            ->orderBy('start_date')
            ->distinct('id')
            ->get();

        return Inertia::render('dashboard', [
            'totalStudent' => $totalStudetn,
            'totalBatchs' => $totalBatch,
            'totalCourses' => $totalCourses,
            'totalLeads' => $totalleads,
            'activeCalls' => $ActiveCalls,
            'conversionRate' => $ConversionRate,
            'followUpsToday' => $Follow_ups_Today,
            'batches' => $batches,
            'courses' => Course::select('id', 'name')->get(),
        ]);

    }

    public function usersPermissions()
    {
        return Inertia::render('settings/UsersPermissions');
    }
}
