-- users: admin + customer
-- (pretpostavka: users tablica ima: id, email, password_hash, role, created_at)

-- proizvodi (primjeri)
INSERT INTO products (name, description, price_cents, stock, image_url, is_active)
VALUES
('Gaming tipkovnica', 'Mehanička tipkovnica s RGB osvjetljenjem i HR layout opcijom.', 7999, 15, NULL, 1),
('Bežični miš', 'Ergonomski miš s dugotrajnom baterijom i 2.4GHz receiverom.', 2999, 30, NULL, 1),
('USB-C Hub', 'Hub s HDMI, USB 3.0 i SD čitačem – idealno za laptop.', 2499, 20, NULL, 1),
('Monitor 27"', '27" IPS monitor 144Hz za rad i gaming.', 18999, 8, NULL, 1);
