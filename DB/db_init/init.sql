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

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    join_date VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    stream_key VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    devicename VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    wifi_name VARCHAR(255),
    location VARCHAR(255),
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    image VARCHAR(500), -- 사진 URL
    memo TEXT, -- 특이사항
    weight FLOAT,
    health_status VARCHAR(255) NOT NULL, -- Enum 값 (예: HEALTHY, SICK 등)
    ai_data_file VARCHAR(255), -- AI 학습용 데이터 파일 경로
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);