/*
  # Database Performance and Integrity Improvements

  1. Indexes
    - Add performance indexes for common queries
    - Composite indexes for complex filtering
    
  2. Constraints
    - Add check constraints for data validation
    - Foreign key constraints for referential integrity
    
  3. Security
    - Enhanced RLS policies
    - Audit triggers for sensitive operations
*/

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_status ON bookings(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_created ON bookings(status, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_location_pickup ON bookings(pickup_lat, pickup_lng);
CREATE INDEX IF NOT EXISTS idx_bookings_location_dropoff ON bookings(dropoff_lat, dropoff_lng);
CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON profiles(role, status);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(lat, lng) WHERE role = 'driver';
CREATE INDEX IF NOT EXISTS idx_ride_messages_booking ON ride_messages(booking_id, created_at);
CREATE INDEX IF NOT EXISTS idx_driver_documents_driver_type ON driver_documents(driver_id, document_type);

-- Add check constraints for data validation
ALTER TABLE bookings ADD CONSTRAINT check_passengers_positive CHECK (passengers > 0 AND passengers <= 8);
ALTER TABLE bookings ADD CONSTRAINT check_luggage_reasonable CHECK (luggage >= 0 AND luggage <= 10);
ALTER TABLE bookings ADD CONSTRAINT check_price_positive CHECK (estimated_price >= 0 AND (actual_price IS NULL OR actual_price >= 0));
ALTER TABLE bookings ADD CONSTRAINT check_valid_status CHECK (status IN ('pending_confirmation', 'confirmed', 'en_route_pickup', 'at_pickup', 'in_progress', 'completed', 'cancelled'));
ALTER TABLE bookings ADD CONSTRAINT check_valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));

ALTER TABLE profiles ADD CONSTRAINT check_valid_role CHECK (role IN ('client', 'driver', 'admin'));
ALTER TABLE profiles ADD CONSTRAINT check_valid_driver_status CHECK (
  (role != 'driver') OR 
  (role = 'driver' AND status IN ('pending_approval', 'active', 'inactive', 'suspended'))
);

-- Add missing foreign key constraints
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_driver FOREIGN KEY (driver_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE favorite_addresses ADD CONSTRAINT fk_favorite_addresses_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Enhanced RLS policies
DROP POLICY IF EXISTS "Users can read own data" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Drivers can see other active drivers (for map display)
CREATE POLICY "Drivers can see active drivers" ON profiles FOR SELECT TO authenticated 
USING (role = 'driver' AND status = 'active' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver'
));

-- Booking policies
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT TO authenticated 
USING (user_id = auth.uid() OR driver_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Drivers can update assigned bookings" ON bookings FOR UPDATE TO authenticated 
USING (driver_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update driver profiles" ON profiles FOR UPDATE TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') AND role = 'driver');

-- Audit function for sensitive operations
CREATE OR REPLACE FUNCTION audit_booking_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      INSERT INTO booking_audit_log (booking_id, old_status, new_status, changed_by, changed_at)
      VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), NOW());
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS booking_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  old_status text,
  new_status text,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz DEFAULT now()
);

-- Create trigger
DROP TRIGGER IF EXISTS booking_audit_trigger ON bookings;
CREATE TRIGGER booking_audit_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION audit_booking_changes();

-- Enable RLS on audit log
ALTER TABLE booking_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit logs" ON booking_audit_log FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));