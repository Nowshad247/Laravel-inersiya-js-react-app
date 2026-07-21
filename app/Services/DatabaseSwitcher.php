<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DatabaseSwitcher
{
    const CACHE_KEY = 'active_database_connection';
    const PRIMARY = 'mysql_primary';
    const SECONDARY = 'mysql_secondary';
    const CACHE_DURATION = 365 * 24 * 60; // 1 year in minutes

    /**
     * Switch to a specific database connection
     *
     * @param string $dbConnection
     * @return void
     * @throws \Exception
     */
    public static function switchDatabase($dbConnection)
    {
        // Validate connection exists
        if (!in_array($dbConnection, [self::PRIMARY, self::SECONDARY])) {
            throw new \Exception('Invalid database connection: ' . $dbConnection);
        }

        // Store active database in cache (persists across requests)
        Cache::put(self::CACHE_KEY, $dbConnection, now()->addMinutes(self::CACHE_DURATION));
        
        // Set it as default immediately
        config(['database.default' => $dbConnection]);
    }

    /**
     * Get the currently active database connection
     *
     * @return string
     */
    public static function getActiveDatabase()
    {
        return Cache::get(self::CACHE_KEY, self::PRIMARY);
    }

    /**
     * Set the active database as the default for this request
     *
     * @return void
     */
    public static function setAsDefault()
    {
        $active = self::getActiveDatabase();
        config(['database.default' => $active]);
    }

    /**
     * Get all available databases
     *
     * @return array
     */
    public static function getAvailableDatabases()
    {
        return [
            self::PRIMARY => 'Primary Database',
            self::SECONDARY => 'Secondary Database',
        ];
    }

    /**
     * Test database connection
     *
     * @param string $dbConnection
     * @return bool
     */
    public static function testConnection($dbConnection)
    {
        try {
            DB::connection($dbConnection)->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
