-- Active: 1759236719174@@127.0.0.1@5432@trello

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- INSERT INTO users (name, email, password)
-- VALUES
-- ('Ali Valiyev', 'ali@example.com', '12345'),
-- ('Dilnoza Karimova', 'dilnoza@example.com', 'password123'),
-- ('Jasur Bekov', 'jasur@example.com', 'qwerty'),
-- ('Malika Rasulova', 'malika@example.com', 'malika2025'),
-- ('Sherzod Akbarov', 'sherzod@example.com', 'sherzod!@#'),
-- ('Nigora Rustamova', 'nigora@example.com', 'nigora789'),
-- ('Bobur Tursunov', 'bobur@example.com', 'bobur654'),
-- ('Gulnoza Saidova', 'gulnoza@example.com', 'gulnoza321'),
-- ('Bekzod Olimov', 'bekzod@example.com', 'bekzod000'),
-- ('Zarina Abdullaeva', 'zarina@example.com', 'zarina777');
-- -- 

CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    board_id UUID REFERENCES boards(id) ON DELETE SET NULL 
);


CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
    column_id UUID REFERENCES columns(id) ON DELETE SET NULL
);





