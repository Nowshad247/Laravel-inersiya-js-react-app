<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdmsController extends Controller
{
    /**
     * Handle the ADMS "cdata" endpoint used for the device handshake and
     * for the device pushing attendance/data batches.
     *
     * Phase 1 only proves connectivity: it does not parse or persist any
     * attendance payload yet.
     */
    public function cdata(Request $request)
    {
        $serialNumber = (string) $request->query('SN', '');

        $this->touchDeviceBySerial($serialNumber, $request->ip());

        if ($request->isMethod('get') && $request->query('options') === 'all') {
            $response = $this->buildHandshakeResponse($serialNumber);
        } else {
            $response = 'OK';
        }

        $this->logAdmsRequest($request, '/iclock/cdata', $response);

        return response($response, 200)->header('Content-Type', 'text/plain');
    }

    /**
     * Handle the ADMS "getrequest" endpoint used by the device to poll for
     * commands. Phase 1 always replies OK (no command queue yet).
     */
    public function getrequest(Request $request)
    {
        $serialNumber = (string) $request->query('SN', '');

        $this->touchDeviceBySerial($serialNumber, $request->ip());

        $response = 'OK';

        $this->logAdmsRequest($request, '/iclock/getrequest', $response);

        return response($response, 200)->header('Content-Type', 'text/plain');
    }

    /**
     * Build the plain-text ADMS handshake/configuration reply.
     */
    private function buildHandshakeResponse(string $serialNumber): string
    {
        return implode("\n", [
            "GET OPTION FROM: {$serialNumber}",
            'Stamp=0',
            'OpStamp=0',
            'ErrorDelay=60',
            'Delay=30',
            'TransTimes=00:00;14:05',
            'TransInterval=1',
            'TransFlag=1111000000',
            'Realtime=1',
            'Encrypt=None',
        ]);
    }

    /**
     * Record the last time a device with this serial number was heard
     * from. Unmatched/unregistered serial numbers are ignored, not
     * rejected, since Phase 1 still needs to capture their traffic.
     */
    private function touchDeviceBySerial(string $serialNumber, ?string $ip): void
    {
        if ($serialNumber === '') {
            return;
        }

        Device::where('device_serial_number', $serialNumber)->update([
            'last_communication_at' => now(),
            'last_communication_ip' => $ip,
        ]);
    }

    /**
     * Write a structured entry to the dedicated ADMS log channel so the
     * raw device traffic can be inspected without digging through
     * laravel.log.
     */
    private function logAdmsRequest(Request $request, string $endpoint, string $response): void
    {
        $rawBody = $request->isMethod('get')
            ? 'N/A'
            : ($request->getContent() !== '' ? $request->getContent() : 'N/A');

        $message = implode("\n", [
            'ADMS REQUEST',
            'Method: '.$request->method(),
            'Endpoint: '.$endpoint,
            'Client IP: '.$request->ip(),
            'Query Parameters:',
            json_encode($request->query(), JSON_PRETTY_PRINT),
            'Raw Body:',
            $rawBody,
            'Response:',
            $response,
            '',
            str_repeat('-', 50),
        ]);

        Log::channel('adms')->info($message);
    }
}
