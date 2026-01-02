<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with(['batch', 'batch.course', 'courses'])->latest()->get();
        return Inertia('student/index', compact('students'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $batchs = Batch::all();
        $courses = Course::all();
        return Inertia('student/create', [
            'batchs' => $batchs,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd request to check
        // dd($request->all());

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email',
            'batch_id'   => 'required|exists:batches,id',
            'course_ids' => 'required|array',        // <-- match frontend
            'course_ids.*' => 'exists:courses,id',  // <-- each course must exist
        ]);

        // create student (batch_id → one to many)
        $student = Student::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'batch_id' => $validated['batch_id'],
        ]);

        // attach courses (many to many)
        $student->courses()->attach($validated['course_ids']);

        return redirect()
            ->route('student.index')
            ->with('success', 'Student created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $id)
    {
        $student = Student::with(['batch','courses'])->findOrFail($id->id);
        $batchs = Batch::select('id','name')->get();
        $courses = Course::select('id','name')->get();

        return Inertia::render('student/update',[
            'student' =>[
                'id'=>$student->id,
                'name'=>$student->name,
                'email'=>$student->email,
                'batch_id'=>$student->batch_id,
                'course_ids'=>$student->courses->pluck('id')

            ],
            'batches'=>$batchs,
            'courses'=>$courses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }
}
