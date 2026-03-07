<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Lead;
use App\Models\Student;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $totalStudetn = Student::Count();
        $totalBatch= Batch::Count();
        $totalCourses = Course::Count();
        $totalleads = Lead::Count();
        $ActiveCalls = Lead::where('status', 'active')->Count();

        $lead = Lead::where('status', 'converted')->Count();

        $ConversionRate = $totalleads > 0 ? round((  $lead / $totalleads) * 100, 2) : 0;

        $Follow_ups_Today = Lead::whereDate('follow_up_date', now()->toDateString())->where('is_call', true)->Count();

        return Inertia::render('dashboard',[
            'totalStudent'=> $totalStudetn,
            'totalBatchs'=>$totalBatch,
            'totalCourses'=>$totalCourses,
            'totalLeads'=>$totalleads,
            'activeCalls'=>$ActiveCalls,
            'conversionRate'=>$ConversionRate,
            'followUpsToday'=>$Follow_ups_Today
        ]);

    }
    public function usersPermissions(){
        return Inertia::render('settings/UsersPermissions');
    }
}
