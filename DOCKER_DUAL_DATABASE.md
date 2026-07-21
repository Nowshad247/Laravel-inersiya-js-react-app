# Docker setup for Dual Database Configuration

## Environment Variables (.env.docker)

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

# Primary Database
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=app_password

# Secondary Database (Dual Database Setup)
DB_HOST_2=mysql_secondary
DB_PORT_2=3306
DB_DATABASE_2=app_db_secondary
DB_USERNAME_2=app_user
DB_PASSWORD_2=app_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Cache
CACHE_STORE=database
SESSION_DRIVER=database
```

## Services Running

### Primary Database (MySQL)
- **Container**: laravel_mysql
- **Host**: mysql (from app service)
- **Port**: 3306
- **Database**: app_db
- **PhpMyAdmin**: http://localhost:8080

### Secondary Database (MySQL)
- **Container**: laravel_mysql_secondary
- **Host**: mysql_secondary (from app service)
- **Port**: 3306
- **Database**: app_db_secondary
- **PhpMyAdmin**: http://localhost:8081

### Application
- **Container**: laravel_app
- **Port**: 8000
- **URL**: http://localhost:8000

### Cache/Queue (Redis)
- **Container**: laravel_redis
- **Port**: 6379

## Startup Commands

### Start all services
```bash
docker-compose up -d
```

### Start with build (if Dockerfile changed)
```bash
docker-compose up -d --build
```

### Run migrations on both databases
```bash
docker-compose exec app php artisan migrate:dual --database=all
```

### Run migrations on primary only
```bash
docker-compose exec app php artisan migrate:dual --database=primary
```

### Run migrations on secondary only
```bash
docker-compose exec app php artisan migrate:dual --database=secondary
```

### View logs
```bash
docker-compose logs app
docker-compose logs mysql
docker-compose logs mysql_secondary
```

### Stop services
```bash
docker-compose down
```

### Stop and remove data
```bash
docker-compose down -v
```

## Database Access

### From Host Machine (via CLI)
```bash
# Primary Database
mysql -h 127.0.0.1 -u app_user -p -D app_db

# Secondary Database
mysql -h 127.0.0.1 -u app_user -p -D app_db_secondary
```

### Via PhpMyAdmin
- **Primary DB**: http://localhost:8080
  - Server: mysql
  - Username: app_user
  - Password: (from .env)

- **Secondary DB**: http://localhost:8081
  - Server: mysql_secondary
  - Username: app_user
  - Password: (from .env)

### Inside App Container (via shell)
```bash
docker-compose exec app bash

# Inside container, test connection to primary
mysql -h mysql -u app_user -p -e "SELECT 1;"

# Test connection to secondary
mysql -h mysql_secondary -u app_user -p -e "SELECT 1;"
```

## Data Persistence

Docker volumes are used to persist data:
- `mysql_data` - Primary database data
- `mysql_secondary_data` - Secondary database data
- `redis_data` - Redis cache data

## Performance Notes

1. **Sequential Builds**: Supervisor is included in Alpine layer for efficient container size
2. **Health Checks**: Both databases have health checks to ensure readiness
3. **Service Dependencies**: App depends on healthy database services before starting
4. **Volume Mounts**: Source code is mounted for development purposes

## Troubleshooting

### Containers won't start
```bash
docker-compose down -v
docker-compose up -d --build
```

### Database connection failed
```bash
# Check if databases are healthy
docker-compose ps

# Check database logs
docker-compose logs mysql
docker-compose logs mysql_secondary
```

### Permission denied errors
```bash
# Fix file permissions
docker-compose exec app chown -R www-data:www-data /app
docker-compose exec app chmod -R 755 /app
```

## Notes for Production

- Remove volume binds from docker-compose.yml
- Set `APP_DEBUG=false`
- Use environment-specific secrets instead of .env
- Add SSL/TLS configuration to nginx
- Configure proper backup strategy for database volumes
- Use managed database services instead of containers
