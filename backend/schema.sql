-- Schema for ArchiveWH
CREATE DATABASE IF NOT EXISTS archivewh;
USE archivewh;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS army_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  mode VARCHAR(32),
  points INT,
  faction VARCHAR(100) NOT NULL,
  units JSON,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS battle_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS codex (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT,
  title VARCHAR(255) NOT NULL,
  universe VARCHAR(32),
  mode VARCHAR(32),
  faction VARCHAR(100),
  range_weapons JSON,
  melee_weapons JSON,
  range_weapon VARCHAR(255),
  range_bonus VARCHAR(255),
  range_range VARCHAR(32),
  range_attacks INT,
  range_strength INT,
  range_ap INT,
  range_damage VARCHAR(32),
  melee_weapon VARCHAR(255), 
  melee_bonus VARCHAR(255),
  melee_attacks INT,
  melee_strength INT,
  melee_ap INT,
  melee_damage VARCHAR(32),
  abilitie TEXT,
  points INT,
  keywords VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Compte admin test
INSERT INTO users (username, password_hash, is_admin)
VALUES ('admin', 'admin123', 1)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  is_admin = VALUES(is_admin);
INSERT INTO users (username, password_hash) VALUES ('user1', 'user123') ON DUPLICATE KEY UPDATE id=id;
UPDATE users SET is_admin=1 WHERE username='admin';