<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DevicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $devices = Device::orderBy('created_at', 'desc')
            ->get()
            ->map(function (Device $device) {
                return [
                    'id' => $device->id,
                    'deviceName' => $device->device_name,
                    'deviceType' => $device->device_type ?? 'Unknown',
                    'deviceIp' => $device->device_ip ?? '-',
                    'devicePort' => $device->device_port ?? '-',
                    'serialNumber' => $device->device_serial_number ?? '-',
                    'location' => $device->device_location ?? '-',
                    'syncInterval' => $device->sync_interval,
                    'status' => ucfirst($device->device_status ?? 'inactive'),
                    'connectionType' => $device->connection_type ?? '-',
                    'lastCommunicationAt' => $device->last_communication_at?->toIso8601String(),
                    'lastCommunicationIp' => $device->last_communication_ip,
                ];
            })
            ->toArray();

        return Inertia::render('devices-manager/index', [
            'devices' => $devices,
            'stats' => [
                'totalDevices' => Device::count(),
                'activeDevices' => Device::where('device_status', 'active')->count(),
                'errorDevices' => Device::where('device_status', 'error')->count(),
            ],
            'adms' => [
                'cdataUrl' => url('/iclock/cdata'),
                'getRequestUrl' => url('/iclock/getrequest'),
            ],
        ]);
    }

    /**
     * Store a newly registered device.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_name' => ['required', 'string', 'max:255'],
            'device_type' => ['nullable', 'string', 'max:255'],
            'device_ip' => ['nullable', 'string', 'max:45'],
            'device_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'device_serial_number' => ['nullable', 'string', 'max:255', Rule::unique('devices', 'device_serial_number')],
            'device_location' => ['nullable', 'string', 'max:255'],
            'sync_interval' => ['nullable', 'integer', 'min:1'],
            'device_status' => ['required', Rule::in(['active', 'inactive', 'error', 'offline', 'connecting'])],
            'connection_type' => ['nullable', 'string', 'max:255'],
        ], [
            'device_name.required' => 'Device name is required.',
            'device_serial_number.unique' => 'A device with this serial number is already registered.',
        ]);

        Device::create($validated);

        return redirect()->route('devices-manager.index')->with('success', 'Device added successfully.');
    }
}
