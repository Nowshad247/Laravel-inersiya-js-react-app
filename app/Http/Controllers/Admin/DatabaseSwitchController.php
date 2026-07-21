<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DatabaseSwitcher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DatabaseSwitchController extends Controller
{
    /**
     * Get current database status
     */
    public function status()
    {
        $current = DatabaseSwitcher::getActiveDatabase();
        $available = DatabaseSwitcher::getAvailableDatabases();
        
        // Test connections
        $connectionStatus = [];
        foreach (array_keys($available) as $db) {
            $connectionStatus[$db] = DatabaseSwitcher::testConnection($db);
        }

        return response()->json([
            'current_database' => $current,
            'available_databases' => $available,
            'connection_status' => $connectionStatus,
        ]);
    }

    /**
     * Switch to a different database
     */
    public function switch(Request $request)
    {
        $request->validate([
            'database' => 'required|in:mysql_primary,mysql_secondary'
        ]);

        try {
            // Test connection first
            if (!DatabaseSwitcher::testConnection($request->database)) {
                return back()->with('error', 'Cannot connect to the selected database. Please check your configuration.');
            }

            DatabaseSwitcher::switchDatabase($request->database);

            return back()->with('success', 'Database switched successfully to: ' . DatabaseSwitcher::getAvailableDatabases()[$request->database]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error switching database: ' . $e->getMessage());
        }
    }
}
