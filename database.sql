
INSERT INTO houses (bedroom, bathroom, house_location, furnished, price, offer, _description, parking, _type) VALUES (6, 3, 'norcross, GA', true, 500000, false, 'A very nice house in GA great for rental property', true, 'Rent');

CREATE TABLE houses (
    ID SERIAL PRIMARY KEY,
    bedroom INT NOT NULL,
    bathroom INT NOT NULL,
    house_location VARCHAR(20),
    furnished BOOLEAN,
    price INT NOT NULL,
    offer BOOLEAN,
    _description VARCHAR(100),
    parking BOOLEAN,
    _type VARCHAR(20),
    image_url VARCHAR(200)
);

