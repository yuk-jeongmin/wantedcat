CREATE DATABASE IF NOT EXISTS my_app_db;
USE my_app_db;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    event_time DATETIME,
    duration_seconds FLOAT,
    weight_info VARCHAR(255),
    video_url VARCHAR(255)
);

