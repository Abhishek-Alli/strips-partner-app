# Supabase Database Setup

## Getting Your Database Credentials

1. Go to your Supabase project: https://escmgtuixqydcofpguay.supabase.co
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **Connection string** (URI format) or note down:
   - **Host**: `db.escmgtuixqydcofpguay.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (shown in connection string)

## Configuration Options

### Option 1: Connection String (Recommended)

Add to your `.env` file:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your actual database password.

### Option 2: Individual Parameters

Add to your `.env` file:

```env
DB_HOST=db.escmgtuixqydcofpguay.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_SSL=true
```

## Important Notes

- **SSL is required** for Supabase connections
- The connection string format is: `postgresql://user:password@host:port/database`
- Your database password is different from your Supabase project password
- Keep your database password secure and never commit it to version control

## Testing Connection

After setting up, test the connection:

```bash
npm run migrate
```

If successful, you should see: `✅ Database migrations completed successfully`



