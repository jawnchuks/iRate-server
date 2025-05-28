import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Get the DATABASE_URL directly from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Validate database URL format
  if (!databaseUrl.includes('://') || !databaseUrl.includes('@')) {
    throw new Error(
      'Invalid DATABASE_URL format. Expected format: postgresql://user:password@host:port/database',
    );
  }

  // Log the database URL (with password masked)
  const maskedUrl = databaseUrl.replace(/(:\/\/[^:]+:)([^@]+)@/, '$1****@');
  console.log('Database URL:', maskedUrl);

  // Extract connection details from URL
  const url = new URL(databaseUrl);
  const host = url.hostname;
  const port = parseInt(url.port || '5432', 10);
  const username = url.username;
  const password = url.password;
  const database = url.pathname.substring(1); // Remove leading slash

  return {
    url: databaseUrl,
    host,
    port,
    username,
    password,
    database,
  };
});
