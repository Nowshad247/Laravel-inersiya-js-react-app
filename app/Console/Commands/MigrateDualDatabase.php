<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migrator;

class MigrateDualDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:dual {--database=all : Run migrations on specific database (primary, secondary, or all)} {--force : Force the operation to run when in production}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrations on both primary and secondary databases, or skip if already migrated';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $database = $this->option('database');
        $force = $this->option('force');

        // Validate database option
        if (!in_array($database, ['all', 'primary', 'secondary'])) {
            $this->error('Invalid database option. Use: all, primary, or secondary');
            return 1;
        }

        $databases = [];
        if ($database === 'all') {
            $databases = ['mysql_primary', 'mysql_secondary'];
        } elseif ($database === 'primary') {
            $databases = ['mysql_primary'];
        } else {
            $databases = ['mysql_secondary'];
        }

        $forceFlag = $force ? '--force' : '';

        foreach ($databases as $db) {
            try {
                $this->info("Checking migrations status for: {$db}");

                // Check if migrations table exists and if migrations are needed
                if ($this->needsMigration($db)) {
                    $this->info("Running migrations for: {$db}");
                    $this->call('migrate', [
                        '--database' => $db,
                        '--force' => $force,
                    ]);
                    $this->info("✓ Migrations completed for: {$db}");
                } else {
                    $this->info("⊗ {$db} already has all migrations. Skipping...");
                }
            } catch (\Exception $e) {
                $this->error("Error migrating {$db}: " . $e->getMessage());
                continue;
            }
        }

        $this->info('Dual database migration process completed!');
        return 0;
    }

    /**
     * Check if a database needs migrations
     *
     * @param string $database
     * @return bool
     */
    private function needsMigration($database)
    {
        try {
            // Try to get migration status
            $migrator = app('migrator');
            
            // Set the database connection
            $connection = DB::connection($database);
            
            // Check if migrations table exists
            if (!$connection->getSchemaBuilder()->hasTable('migrations')) {
                return true;
            }

            // Check if there are pending migrations
            $migrator->setConnection($database);
            $pending = $migrator->getMigrationFiles(database_path('migrations'));
            $migrated = $connection->table('migrations')->pluck('migration')->toArray();

            foreach ($pending as $migration) {
                if (!in_array($migration, $migrated)) {
                    return true;
                }
            }

            return false;
        } catch (\Exception $e) {
            // If any error, assume migration is needed
            return true;
        }
    }
}
