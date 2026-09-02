
CREATE DATABASE IF NOT EXISTS hoomaninneed;
USE hoomaninneed;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('donor', 'volunteer', 'organization', 'admin') DEFAULT 'donor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donor_id INT NOT NULL,
  food_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50),
  ingredients TEXT,
  allergens JSON,
  pickup_deadline DATETIME NOT NULL,
  location TEXT NOT NULL,
  safety_notes TEXT,
  status ENUM('available', 'accepted', 'picked_up', 'in_transit', 'delivered', 'completed', 'expired', 'cancelled') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donation_id INT UNIQUE NOT NULL,
  volunteer_id INT NOT NULL,
  organization_id INT,
  status ENUM('accepted', 'picked_up', 'in_transit', 'delivered', 'completed') DEFAULT 'accepted',
  accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES users(id) ON DELETE SET NULL
);
