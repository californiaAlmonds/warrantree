-- WarranTree Seed Data
-- Inserts initial categories and demo data

-- Insert default categories
INSERT INTO categories (name, description, icon, reminder_days_default) VALUES
('Electronics', 'TV, smartphones, laptops, gaming consoles', 'cpu-chip', 30),
('Appliances', 'Kitchen appliances, washing machines, HVAC', 'home', 60),
('Insurance', 'Health, auto, home, life insurance policies', 'shield-check', 30),
('Documents', 'Important documents, certificates, contracts', 'document-text', 90),
('Vehicles', 'Cars, motorcycles, boats, maintenance records', 'truck', 90),
('Home & Garden', 'Tools, furniture, gardening equipment', 'home-modern', 30),
('Health & Beauty', 'Medical devices, cosmetics, fitness equipment', 'heart', 30),
('Other', 'Miscellaneous items and warranties', 'ellipsis-horizontal', 30);

-- Insert demo user (password is 'password' hashed with bcrypt)
INSERT INTO users (email, password, name, role, email_verified) VALUES
('demo@warrantree.com', '$2a$10$CRa0ky.5J2RtRQzJIjLZfeE0VC9LAKGjKKNKJZ3w7oC4eNJ9ljfxq', 'Demo User', 'USER', true);

-- Get the demo user ID for creating demo data
-- Insert demo vault
INSERT INTO vaults (name, description, owner_user_id) VALUES
('Family Vault', 'Shared family warranties and documents', 1);

-- Insert some demo items
INSERT INTO items (vault_id, category_id, title, brand, model, purchase_date, price, warranty_months, expiry_date, status, notes) VALUES
(1, 1, 'Samsung Smart TV', 'Samsung', 'QN55Q80T', '2023-06-15', 1299.99, 24, '2025-06-15', 'ACTIVE', '55-inch QLED TV with warranty until June 2025'),
(1, 1, 'iPhone 14 Pro', 'Apple', 'A2890', '2023-09-20', 999.99, 12, '2024-09-20', 'EXPIRING_SOON', 'Personal phone with AppleCare+'),
(1, 2, 'KitchenAid Mixer', 'KitchenAid', 'KSM150PSER', '2022-12-01', 349.99, 12, '2023-12-01', 'EXPIRED', 'Stand mixer for baking'),
(1, 3, 'Auto Insurance Policy', 'State Farm', 'POL-789456', '2024-01-01', 1200.00, 12, '2025-01-01', 'ACTIVE', 'Annual auto insurance renewal'),
(1, 5, 'Toyota Camry Warranty', 'Toyota', '2022 Camry LE', '2022-03-15', 28500.00, 36, '2025-03-15', 'ACTIVE', 'Comprehensive vehicle warranty');

-- Insert some demo reminder schedules
INSERT INTO reminder_schedules (item_id, reminder_date, days_before, email_sent) VALUES
(2, '2024-08-21', 30, false),  -- iPhone expiring in 30 days
(2, '2024-09-13', 7, false),   -- iPhone expiring in 7 days
(4, '2024-12-02', 30, false),  -- Auto insurance expiring in 30 days
(5, '2025-02-13', 30, false);  -- Toyota warranty expiring in 30 days 