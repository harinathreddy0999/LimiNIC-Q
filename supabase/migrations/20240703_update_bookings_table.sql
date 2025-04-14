-- Add payment fields to bookings table
ALTER TABLE IF EXISTS bookings
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2);

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);
