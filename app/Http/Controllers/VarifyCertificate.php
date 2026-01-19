<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VarifyCertificate extends Controller
{
    public function index()
    {
        return Inertia::render('welcome');
    }
    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'uid' => [
                    'required',
                    'string',
                    'regex:/^SDC-[A-Z]{2,5}-\d{4}-\d{4}-[A-Z]-\d+$/'
                ],
            ]);

            if(!$validated){
                 return Inertia::render('welcome', [
                    'status' => false,
                    'message' => 'Validation error',
                    'data' => null,
                ]);
            }
            $student = Student::query()
                ->where('student_uid', $validated['uid'])->with('courses')
                ->first();

            if (!$student) {
                // Not found
                return Inertia::render('welcome', [
                    'status' => false,
                    'message' => 'Certificate not found',
                    'data' => null,
                ]);
            }
            // Found
            
            return Inertia::render('welcome', [
                'status' => true,
                'message' => 'Certificate found',
                'data' => [
                    'name'        => $student->name,
                    'courses' => $student->courses[0],
                    'issued_at'   => $student->created_at->toDateString(),
                    'certificate' => $student->student_uid,
                ],
            ]);
        } catch (ValidationException $e) {
            // Validation error
            return Inertia::render('Welcome', [
                'status' => false,
                'message' => $e->validator->errors()->first('uid'),
                'data' => null,
            ]);
        } catch (Exception $e) {
            // Any unexpected error
            return Inertia::render('welcome', [
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'data' => null,
            ]);
        }
    }
    public function dashboardView()
    {
        return Inertia::render('dashboard');
    }
}
