import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Get the DATABASE_URL directly from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Log the database URL (with password masked)
  const maskedUrl = databaseUrl.replace(/(:\/\/[^:]+:)([^@]+)@/, '$1****@');
  console.log('Database URL:', maskedUrl);

  return {
    url: databaseUrl,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432', 10),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  };
});
