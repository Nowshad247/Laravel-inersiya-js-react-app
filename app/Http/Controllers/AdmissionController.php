<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\Batch;
use App\Models\Course;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdmissionController extends Controller
{
    public function index()
    {
        return Inertia::render('admission/index', [
            'courses' => Batch::with('course')->get()->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'batch_name' => $batch->name,
                    'course_name' => $batch->course ? $batch->course->name : null,
                ];
            }),
        ]);
    }

    public function create()
    {
        return Inertia::render('admission/create', [
            'batchs' => Batch::select('id', 'name', 'course_id')->get(),
            'courses' => Course::select('id', 'name')->get(),
            'admissions' => Admission::with('batch')->latest()->get(),
        ]);
    }

    public function show(Admission $admission)
    {
        return Inertia::render('admission/show', [
            'admission' => $admission->load('batch'),
            'batchs' => Batch::select('id', 'name', 'course_id')->get(),
            'courses' => Course::select('id', 'name')->get(),
        ]);
    }

    public function approve(Request $request, Admission $admission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['required', 'string', 'max:255'],
            'mother_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('students', 'email')],
            'phone' => ['nullable', 'string', 'max:20', Rule::unique('students', 'phone')],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:20'],
            'guardian_relation' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'batch_id' => ['required', 'exists:batches,id'],
            'course_ids' => ['required', 'array', 'min:1'],
            'course_ids.*' => ['exists:courses,id'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        DB::beginTransaction();
        try {
            // handle photo if uploaded, otherwise keep existing admission photo
            $photoPath = $admission->photo;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('students', 'public');
            }
            // create student with only student table fields
            $student = Student::create([
                'name' => $validated['name'],
                'father_name' => $validated['father_name'],
                'mother_name' => $validated['mother_name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
                'guardian_relation' => $validated['guardian_relation'] ?? null,
                'status' => $validated['status'] ?? 'active',
                'batch_id' => $validated['batch_id'] ?? null,
                'photo' => $photoPath,
            ]);
            // attach courses
            if (!empty($validated['course_ids'])) {
                $student->courses()->sync($validated['course_ids']);
            }
            // generate student UID using the same rules as StudentController
            $batch = Batch::find($validated['batch_id']);
            if ($batch) {
                $courseCode = Course::whereIn('id', $validated['course_ids'])->pluck('course_code')->first() ?? 'XXX';
                $yymm = Carbon::parse($batch->start_date)->format('ym');
                $lastStudent = Student::where('batch_id', $batch->id)->whereNotNull('student_uid')->latest('id')->first();
                $lastSerial = $lastStudent ? (int) substr($lastStudent->student_uid, -6, 4) : 0;
                $serialNumber = str_pad($lastSerial + 1, 4, '0', STR_PAD_LEFT);
                $firstLetter = strtoupper(substr($student->name, 0, 1));
                $student->update(['student_uid' => "SDC-{$courseCode}-{$yymm}-{$serialNumber}-{$firstLetter}-{$student->id}"]);
            }
            // update admission record
            $admission->update([
                'approved_by' => auth()->id(),
                'approved_status' => 'active',
                'status' => 'active',
            ]);
            DB::commit();
            $uid = $student->fresh()->student_uid;
            $redirectUrl = $uid
                ? '/billings/create-invoice?uid=' . urlencode($uid)
                : route('admission');
            return redirect($redirectUrl)->with('success', 'Admission approved and student created.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['required', 'string', 'max:255'],
            'mother_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('admissions', 'email'),
                function ($attribute, $value, $fail) {
                    if (DB::table('students')->where('email', $value)->exists()) {
                        $fail('The '.$attribute.' has already been taken.');
                    }
                },
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('admissions', 'phone'),
                function ($attribute, $value, $fail) {
                    if (DB::table('students')->where('phone', $value)->exists()) {
                        $fail('The '.$attribute.' has already been taken.');
                    }
                },
            ],
            'address' => ['nullable', 'string'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:20'],
            'guardian_relation' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'batch_id' => ['required', 'exists:batches,id'],
            'course_ids' => ['required', 'array', 'min:1'],
            'course_ids.*' => ['exists:courses,id'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('admissions', 'public');
        }

        $admission = Admission::create([
            'name' => $validated['name'],
            'father_name' => $validated['father_name'],
            'mother_name' => $validated['mother_name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'guardian_relation' => $validated['guardian_relation'] ?? null,
            'status' => 'inactive',
            'batch_id' => $validated['batch_id'],
            'course_ids' => $validated['course_ids'],
            'photo' => $photoPath,
            'approved_by' => null,
            'approved_status' => 'Pending',
        ]);

        return redirect()->route('admission.create')
            ->with('success', 'Admission submitted successfully.')
            ->with('admission_id', $admission->id);
    }
}
