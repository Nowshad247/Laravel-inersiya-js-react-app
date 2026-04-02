<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\BatchDetail;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $batches = Batch::with('course')->latest()->get();
        return Inertia::render('batch/index', [
            'batches' => $batches
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('batch/create', ['courses' => Course::select('id', 'name')->get(),]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $batchValidated = $request->validate([
                // Batch Info
                'name' => ['required', 'string', 'max:255'],
                'batch_code' => ['required', 'string', 'max:10', Rule::unique('batches', 'batch_code')],
                'course_id' => ['required', 'exists:courses,id'],
                'start_date' => ['required', 'date'],
                'end_date' => ['required', 'date', 'after_or_equal:start_date'],
                'TotalClass' => ['required', 'integer', 'min:1', 'max:500'],
                'batch_status' => ['required', 'string', 'max:50'],
                
                // Batch Details - Optional
                'total_classes' => ['nullable', 'integer', 'min:1'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'discount_price' => ['nullable', 'numeric', 'min:0'],
                'batch_modules' => ['nullable', 'string'],
                'weekdays' => ['nullable', 'array'],
                'weekdays.*' => ['string'],
                'class_time' => ['nullable', 'string', 'max:100'],
                'delivery_mode' => ['nullable', 'in:online,offline'],
                'description' => ['nullable', 'string'],
                'opportunity' => ['nullable', 'string'],
                'faq_json' => ['nullable', 'json'],
                'instructor_details_json' => ['nullable', 'json'],
            ], [
                'name.required' => 'Batch name is required.',
                'name.max' => 'Batch name can\'t exceed 255 characters.',
                'batch_code.required' => 'Batch code is required.',
                'batch_code.max' => 'Batch code can\'t exceed 10 characters.',
                'batch_code.unique' => 'This batch code is already in use.',
                'course_id.required' => 'Please select a course.',
                'course_id.exists' => 'The selected course does not exist.',
                'start_date.required' => 'Start date is required.',
                'end_date.required' => 'End date is required.',
                'end_date.after_or_equal' => 'End date must be same as or after start date.',
                'TotalClass.required' => 'Total class count is required.',
                'TotalClass.min' => 'Total class must be at least 1.',
                'batch_status.required' => 'Batch status is required.',
                'total_classes.integer' => 'Duration must be a number.',
                'price.numeric' => 'Price must be a valid number.',
                'discount_price.numeric' => 'Discount price must be a valid number.',
                'delivery_mode.in' => 'Delivery mode must be online or offline.',
                'faq_json.json' => 'FAQ data is invalid JSON format.',
                'instructor_details_json.json' => 'Instructor details must be valid JSON format.',
            ]);

            // Create Batch
            $batch = Batch::create([
                'name' => $batchValidated['name'],
                'batch_code' => $batchValidated['batch_code'],
                'course_id' => $batchValidated['course_id'],
                'start_date' => $batchValidated['start_date'],
                'end_date' => $batchValidated['end_date'],
                'TotalClass' => $batchValidated['TotalClass'],
                'batch_status' => $batchValidated['batch_status'],
            ]);

            if (!$batch) {
                DB::rollBack();
                return back()->withErrors([
                    'general' => 'Batch could not be created due to a server issue. Please try again.'
                ]);
            }

            // Create Batch Details
            $batchDetailData = [
                'batch_id' => $batch->id,
                'total_classes' => $batchValidated['total_classes'] ?? null,
                'price' => $batchValidated['price'] ?? null,
                'discount_price' => $batchValidated['discount_price'] ?? null,
                'batch_modules' => $batchValidated['batch_modules'] ?? null,
                'weekdays' => !empty($batchValidated['weekdays']) ? $batchValidated['weekdays'] : null,
                'class_time' => $batchValidated['class_time'] ?? null,
                'delivery_mode' => $batchValidated['delivery_mode'] ?? null,
                'description' => $batchValidated['description'] ?? null,
                'opportunity' => $batchValidated['opportunity'] ?? null,
            ];

            // Parse JSON fields
            if (!empty($batchValidated['faq_json'])) {
                $batchDetailData['faq'] = json_decode($batchValidated['faq_json'], true);
            }

            if (!empty($batchValidated['instructor_details_json'])) {
                $batchDetailData['instructor_details'] = json_decode($batchValidated['instructor_details_json'], true);
            }

            // Create batch detail record
            $batchDetail = BatchDetail::create($batchDetailData);

            if (!$batchDetail) {
                Log::warning('Batch detail creation warning for batch ID: ' . $batch->id);
            }

            DB::commit();

            return redirect()->route('batch.index')->with('success', 'Batch created successfully with all details.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Batch Create Failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()
                ->withInput()
                ->withErrors([
                    'general' => 'An error occurred while creating the batch. Error: ' . $e->getMessage()
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Batch $id)
    {
        $batchData = Batch::with(
            'students',
            'course:id,name',
            
        )->findOrFail($id->id);

        $batchDetail = BatchDetail::where('batch_id', $id->id)->first();

        return Inertia::render("batch/show", [
            'batch' => $batchData,
            'batchDetail' => $batchDetail,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $id)
    {
        $data = Batch::with('batchDetail')->findOrFail($id->id);

        $batch = [
            'id' => $data->id,
            'name' => $data->name,
            'course_id' => $data->course_id,
            'batch_code' => $data->batch_code,
            'start_date' => $data->start_date,
            'end_date' => $data->end_date,
            'TotalClass' => $data->TotalClass,
            'batch_status' => $data->batch_status,
            // Batch Details
            'total_classes' => $data->batchDetail?->total_classes,
            'price' => $data->batchDetail?->price,
            'discount_price' => $data->batchDetail?->discount_price,
            'batch_modules' => $data->batchDetail?->batch_modules,
            'weekdays' => $data->batchDetail?->weekdays ?? [],
            'class_time' => $data->batchDetail?->class_time,
            'delivery_mode' => $data->batchDetail?->delivery_mode,
            'description' => $data->batchDetail?->description,
            'opportunity' => $data->batchDetail?->opportunity,
            'faq' => $data->batchDetail?->faq ?? [],
            'instructor_details' => $data->batchDetail?->instructor_details,
        ];
        return Inertia::render('batch/update', [
            'batch' => $batch,
            'courses' => Course::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Batch $id)
    {
        try {
            DB::beginTransaction();

            // Validate all inputs
            $validated = $request->validate([
                // Batch Info - Required
                'name' => 'required|string|max:255',
                'course_id' => 'required|exists:courses,id',
                'start_date' => 'required|date',
                'batch_code' => 'required|string|max:10|unique:batches,batch_code,' . $id->id,
                'end_date' => 'required|date|after_or_equal:start_date',
                'TotalClass' => 'required|integer|min:1',
                'batch_status' => 'required|string|max:50',
                
                // Batch Details - Optional
                'total_classes' => ['nullable', 'integer', 'min:1'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'discount_price' => ['nullable', 'numeric', 'min:0'],
                'batch_modules' => ['nullable', 'string'],
                'weekdays' => ['nullable', 'array'],
                'weekdays.*' => ['string'],
                'class_time' => ['nullable', 'string', 'max:100'],
                'delivery_mode' => ['nullable', 'in:online,offline'],
                'description' => ['nullable', 'string'],
                'opportunity' => ['nullable', 'string'],
                'faq_json' => ['nullable', 'json'],
                'instructor_details_json' => ['nullable', 'json'],
            ]);

            // Step 1: Update Batch Information
            $batch = Batch::findOrFail($id->id);
            $batchData = [
                'name' => $validated['name'],
                'course_id' => $validated['course_id'],
                'batch_code' => $validated['batch_code'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'TotalClass' => $validated['TotalClass'],
                'batch_status' => $validated['batch_status'],
            ];
            $batch->update($batchData);

            // Step 2: Prepare Batch Details Data
            $batchDetailData = [
                'total_classes' => $validated['total_classes'] ?? null,
                'price' => $validated['price'] ?? null,
                'discount_price' => $validated['discount_price'] ?? null,
                'batch_modules' => $validated['batch_modules'] ?? null,
                'weekdays' => !empty($validated['weekdays']) ? $validated['weekdays'] : null,
                'class_time' => $validated['class_time'] ?? null,
                'delivery_mode' => $validated['delivery_mode'] ?? null,
                'description' => $validated['description'] ?? null,
                'opportunity' => $validated['opportunity'] ?? null,
            ];

            // Step 3: Parse and add JSON fields
            if (!empty($validated['faq_json'])) {
                $faqData = json_decode($validated['faq_json'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $batchDetailData['faq'] = $faqData;
                }
            }

            if (!empty($validated['instructor_details_json'])) {
                $instructorData = json_decode($validated['instructor_details_json'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $batchDetailData['instructor_details'] = $instructorData;
                }
            }

            // Step 4: Update or Create Batch Details
            if ($batch->batchDetail) {
                // Update existing batch detail
                $batch->batchDetail->update($batchDetailData);
            } else {
                // Create new batch detail if it doesn't exist
                $batchDetailData['batch_id'] = $batch->id;
                BatchDetail::create($batchDetailData);
            }

            DB::commit();

            return redirect()->route('batch.index')->with('success', 'Batch and details updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Batch Update Failed', [
                'batch_id' => $id->id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['general' => 'An error occurred while updating the batch. Please try again.']);
        }
    }

    public function destroy(Batch $id)
    {
        $id->delete();
        return redirect()->route('batch.index')->with('success', 'Batch deleted successfully.');
    }
}
