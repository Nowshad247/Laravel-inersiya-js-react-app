<?php

use App\Http\Controllers\AdmissionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FollowUpScheduledController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\VarifyCertificate;
use App\Http\Middleware\HandleInertiaRequests;
use \App\Http\Controllers\ProfilePictureController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\BillingReportsController;
use App\Http\Controllers\UserController;
use BaconQrCode\Renderer\Module\RoundnessModule;

Route::get('/', [HomePageController::class, 'index'])->name('home');

Route::get('/admission', [AdmissionController::class, 'index'])->name('admission');
Route::get('/admission/create', [AdmissionController::class, 'create'])->name('admission.create');
Route::post('/admission/create', [AdmissionController::class, 'store'])->name('admission.store');
Route::get('/admission/{admission}', [AdmissionController::class, 'show'])->name('admission.show')->middleware('permission:create_students');



Route::post('/admission/{admission}/approve', [AdmissionController::class, 'approve'])->name('admission.approve')->middleware('permission:create_students');
//public routes
// Certificate Varificattion 
Route::get('/certificate', [VarifyCertificate::class, 'index'])->middleware('throttle:10,1');
Route::post('/certificate', [VarifyCertificate::class, 'show'])->middleware('throttle:10,1');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Profile picture upload
    Route::post('user/profile-picture', [ProfilePictureController::class, '__invoke'])->name('user.profile-picture.upload');
    //Deshboard options
    Route::get('/batch', [BatchController::class, 'index'])->name('batch.index')->middleware('permission:view_batches');
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index')->middleware('permission:view_courses');
    // Batch Route
    Route::get('/batch/create', [BatchController::class, 'create'])->name('batch.create')->middleware('permission:create_batches');
    Route::get('batch/show/{id}', [BatchController::class, 'show'])->name('batch.show')->middleware('permission:view_batches');
    Route::post('/batch/create', [BatchController::class, 'store'])->name('batches.store')->middleware('permission:create_batches');
    Route::get('/batch/{id}/edit', [BatchController::class, 'edit'])->name('batch.edit')->middleware('permission:edit_batches');
    Route::put('/batch/edit/{id}', [BatchController::class, 'update'])->name('batch.update')->middleware('permission:edit_batches');
    Route::delete('/batch/{id}', [BatchController::class, 'destroy'])->name('batch.destroy')->middleware('permission:delete_batches');
    //Course Route
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create')->middleware('permission:create_courses');
    Route::post('/courses/create', [CourseController::class, 'store'])->name('courses.store')->middleware('permission:create_courses');
    Route::get('/courses/{id}/edit', [CourseController::class, 'edit'])->name('courses.edit')->middleware('permission:edit_courses');
    Route::put('/courses/edit/{id}', [CourseController::class, 'update'])->name('courses.update')->middleware('permission:edit_courses');
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy')->middleware('permission:delete_courses');
    Route::get('/course/show/{id}', [CourseController::class, 'show'])->name('course.show')->middleware('permission:view_courses');
    // Student Route
    Route::get('/students', [StudentController::class, 'index'])->name('student.index')->middleware('permission:view_students');
    Route::get('/students/create', [StudentController::class, 'create'])->name('student.create')->middleware('permission:create_students');
    Route::post('/students/create', [StudentController::class, 'store'])->name('student.store')->middleware('permission:create_students');
    Route::get('/student/edit/{id}', [StudentController::class, 'edit'])->name('student.edit')->middleware('permission:edit_students');
    Route::put('/students/edit/{id}', [StudentController::class, 'update'])->name('student.update')->middleware('permission:edit_students');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.delete')->middleware('permission:delete_students');

    Route::delete('/admission/{admission}/delete', [AdmissionController::class, 'destroy'])->name('admission.destroy')->middleware('permission:delete_students');

    //Student Profile View Route 
    Route::get('/student/profile/{id}', [StudentController::class, 'studentDetails'])->name('student.profile')->middleware('permission:view_students');


    //Website settings routes
    Route::get('/userspermissions', [RoleController::class, 'index'])->name('users.permissions')->middleware('permission:view_roles');
    Route::get('/role/create', [RoleController::class, 'create'])->name('role.create')->middleware('permission:create_roles');
    Route::post('/role/store', [RoleController::class, 'store'])->name('role.store')->middleware('permission:create_roles');
    Route::get('/role/edit/{id}', [RoleController::class, 'edit'])->name('role.edit')->middleware('permission:edit_roles');
    Route::put('/role/update/{id}', [RoleController::class, 'update'])->name('role.update')->middleware('permission:edit_roles');
    Route::delete('/role/delete/{id}', [RoleController::class, 'destroy'])->name('role.delete')->middleware('permission:delete_roles');
    //Website user Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index')->middleware('permission:view_users');

    Route::get('/users/create', [UserController::class, 'create'])->name('users.create')->middleware('permission:create_users');

    Route::post('/users/create', [UserController::class, 'store'])->name('users.store')->middleware('permission:create_users');

    Route::get('/users/edit/{id}', [UserController::class, 'edit'])->name('users.edit')->middleware('permission:edit_users');
    Route::put('/users/edit/{id}', [UserController::class, 'update'])->name('users.update')->middleware('permission:edit_users');
    Route::delete('/users/delete/{id}', [UserController::class, 'destroy'])->name('users.delete')->middleware('permission:delete_users');
    //Billing Routes
    Route::get('/billings', [BillingController::class, 'index'])->name('billings.index')->middleware('permission:view_billing');
    Route::get('/billings/invoices', [BillingController::class, 'invoices'])->name('billings.invoices')->middleware('permission:view_billing');
    Route::get('/billings/create-invoice', [BillingController::class, 'create'])->name('billings.create-invoice')->middleware('permission:create_billing');
    // Billing API (JSON) – used by create-invoice page
    Route::get('/api/billing/student-search', [BillingController::class, 'studentSearch'])->name('billing.student-search')->middleware('permission:create_billing');
    Route::get('/api/billing/student/{id}', [BillingController::class, 'getStudentInfo'])->name('billing.student-info')->middleware('permission:create_billing');
    Route::post('/billings/invoice/store', [BillingController::class, 'store'])->name('billings.invoice.store')->middleware('permission:create_billing');
    Route::get('/billings/invoice/{id}/preview', [BillingController::class, 'preview'])->name('billings.invoice.preview')->middleware('permission:view_billing');
    Route::get('/billings/invoice/{id}/pdf', [BillingController::class, 'downloadPdf'])->name('billings.invoice.pdf')->middleware('permission:view_billing')->withoutMiddleware([HandleInertiaRequests::class]);
    Route::get('/billings/collections', [BillingController::class, 'collections'])->name('billings.collections')->middleware('permission:view_billing');
    Route::get('/billings/collections/export', [BillingController::class, 'exportDueReport'])->name('billings.collections.export')->middleware('permission:view_billing')->withoutMiddleware([HandleInertiaRequests::class]);
    Route::get('/billings/student/{id}', [BillingController::class, 'studentBilling'])->name('billings.student')->middleware('permission:view_billing');
    Route::get('/billings/reports', [BillingReportsController::class, 'index'])->name('billings.reports')->middleware('permission:view_billing');
    Route::get('/billings/reports/export', [BillingReportsController::class, 'export'])->name('billings.reports.export')->middleware('permission:view_billing')->withoutMiddleware([HandleInertiaRequests::class]);
    //Lead Routes
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index')->middleware('permission:view_leads');
    Route::get('/leads/create', [LeadController::class, 'create'])->name('leads.create')->middleware('permission:create_leads');
    Route::post('/leads/create', [LeadController::class, 'store'])->name('leads.store')->middleware('permission:create_leads');
    Route::get('/leads/upload', [LeadController::class, 'upload'])->name('leads.upload')->middleware('permission:create_leads');
    Route::post('/leads/import', [LeadController::class, 'import'])->name('leads.import')->middleware('permission:create_leads');
    Route::post('/leads/store-status', [LeadController::class, 'storeStatus'])->name('leads.store-status')->middleware('permission:create_leads');
    Route::post('/leads/store-source', [LeadController::class, 'storeSource'])->name('leads.store-source')->middleware('permission:create_leads');
    Route::post('/leads/create', [LeadController::class, 'store'])->name('leads.store')->middleware('permission:create_leads');

    Route::put('/leads/edit/{id}', [LeadController::class, 'update'])->name('leads.update')->middleware('permission:edit_leads');

    Route::delete('/leads/delete/{id}', [LeadController::class, 'destroy'])->name('leads.delete')->middleware('permission:delete_leads');
    Route::get('/leads/call-center', [LeadController::class, 'callCenter'])->name('leads.call-center');
    Route::post('/leads/call-center/{id}', [LeadController::class, 'callupdate'])->name('leads.callupdate');
    Route::get('/leads/call-now/{id}', [LeadController::class, 'callNow'])->name('leads.call-now');
    Route::post('/leads/add-note/{id}', [LeadController::class, 'addNote'])->name('leads.add-note');
    Route::put('/leads/update-status/{id}', [LeadController::class, 'updateStatus'])->name('leads.update-status');
    Route::delete('/leads/delete-note/{id}', [LeadController::class, 'deleteNote'])->name('leads.delete-note');

    Route::post('/leads/add-reminder/{id}', [LeadController::class, 'addReminder'])->name('leads.add-reminder');

    //Lead Redminder update route
    Route::post('/leads/update-reminder/', [LeadController::class, 'updateReminder'])->name('leads.update-reminder');

    //FollowUpScheduled Route 

    Route::get('/lead/FollowUp', [FollowUpScheduledController::class, 'index'])->name('lead.FollowUpScheduled');

    //Lead add call Now
    Route::post('/leads/add-call-log/{id}', [LeadController::class, 'addCallLog'])->name('leads.add-call-now');

    //PDF Generation Route
    Route::get('/student/pdf', [PdfController::class, 'student'])->name('student.pdf')->withoutMiddleware([
        HandleInertiaRequests::class,
    ]);
    Route::get('/student/pdf/{id}', [PdfController::class, 'studentProfile'])->name('student.profile.pdf')->withoutMiddleware([
        HandleInertiaRequests::class,
    ]);

    Route::get('/admin/settings',[SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/admin/settings',[SettingsController::class, 'update'])->name('admin.settings.update');

    Route::get('/download-template', function () {
        $filePath = public_path('lead_import_template.csv');
        return response()->download($filePath, 'lead_import_template.csv', ['Content-Type' => 'text/csv']); })->name('download.template');
});

require __DIR__ . '/settings.php';
