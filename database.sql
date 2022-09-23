
INSERT INTO houses (bedroom, bathroom, house_location, furnished, price, offer, _description, parking, _type, image_url) VALUES (6, 3, 'norcross, GA', true, 500000, false, 'A very nice house in GA great for rental property', true, 'Rent');

CREATE TABLE houses (
    ID SERIAL PRIMARY KEY,
    bedroom INT NOT NULL,
    bathroom INT NOT NULL,
    house_location VARCHAR(20) NOT NULL,
    furnished BOOLEAN NOT NULL,
    price INT NOT NULL,
    offer BOOLEAN NOT NULL,
    _description VARCHAR(100) NOT NULL,
    parking BOOLEAN NOT NULL,
    _type VARCHAR(20) NOT NULL,
    image_url VARCHAR(200)
);

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL
);

