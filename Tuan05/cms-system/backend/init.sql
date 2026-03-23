CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dữ liệu
INSERT INTO posts (title, content) VALUES
('Post 1', 'Content posts 1'),
('Post 2', 'Content posts 2');