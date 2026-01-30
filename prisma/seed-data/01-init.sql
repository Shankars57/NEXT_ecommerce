-- This file is executed by docker-entrypoint-initdb.d
-- The database is already created by the POSTGRES_DB environment variable
-- Just adding a comment to confirm initialization
SELECT 'Database initialized successfully' AS status;