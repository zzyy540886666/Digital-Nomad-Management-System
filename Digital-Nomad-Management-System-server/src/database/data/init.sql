CREATE DATABASE IF NOT EXISTS digital_nomad DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE digital_nomad;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL,
  nickname VARCHAR(100) DEFAULT '微信用户',
  avatar_url VARCHAR(500) DEFAULT '',
  phone VARCHAR(20) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY,
  city_from VARCHAR(100) DEFAULT NULL,
  stay_intent_days INT DEFAULT NULL,
  budget_level ENUM('low', 'medium', 'high') DEFAULT NULL,
  work_type ENUM('remote', 'creator', 'freelance', 'other') DEFAULT NULL,
  interests LONGTEXT DEFAULT NULL,
  skills LONGTEXT DEFAULT NULL,
  privacy_level ENUM('public', 'normal', 'private') DEFAULT 'normal',
  persona_vector_id VARCHAR(100) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  cover_url VARCHAR(500) DEFAULT '',
  images LONGTEXT DEFAULT NULL,
  price_min DECIMAL(10,2) DEFAULT 0,
  price_max DECIMAL(10,2) DEFAULT 0,
  duration_options LONGTEXT DEFAULT NULL,
  tags LONGTEXT DEFAULT NULL,
  price_note TEXT DEFAULT NULL,
  notice TEXT DEFAULT NULL,
  status ENUM('draft', 'published', 'offline') DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE package_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  package_id INT NOT NULL,
  type ENUM('stay', 'cowork', 'service') NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  INDEX idx_package (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE package_optional_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  package_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE package_leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  package_id INT NOT NULL,
  arrival_date DATE NOT NULL,
  stay_days INT DEFAULT 7,
  people_count INT DEFAULT 1,
  budget_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
  work_type ENUM('remote', 'creator', 'freelance', 'other') DEFAULT 'remote',
  note TEXT DEFAULT NULL,
  contact_phone VARCHAR(20) DEFAULT NULL,
  status ENUM('submitted', 'contacted', 'confirmed', 'closed', 'lost') DEFAULT 'submitted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  category ENUM('social', 'culture', 'outdoor', 'build', 'skillshare') DEFAULT 'social',
  cover_url VARCHAR(500) DEFAULT '',
  description TEXT DEFAULT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME DEFAULT NULL,
  venue_poi_id INT DEFAULT NULL,
  venue_name VARCHAR(200) DEFAULT NULL,
  venue_address VARCHAR(300) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  capacity INT DEFAULT NULL,
  fee_type ENUM('free', 'paid') DEFAULT 'free',
  fee_amount DECIMAL(10,2) DEFAULT 0,
  notice TEXT DEFAULT NULL,
  status ENUM('draft', 'published', 'offline') DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE event_signups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('signed', 'cancelled', 'attended') DEFAULT 'signed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_event_user (event_id, user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pois (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('cowork', 'stay', 'food', 'medical', 'transport', 'venue', 'other') DEFAULT 'other',
  name VARCHAR(100) NOT NULL,
  address VARCHAR(300) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  open_hours VARCHAR(100) DEFAULT NULL,
  tags LONGTEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('published', 'offline') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('offer', 'need', 'project') NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  tags LONGTEXT DEFAULT NULL,
  reward_type ENUM('swap', 'paid', 'volunteer') DEFAULT 'swap',
  available_time VARCHAR(100) DEFAULT NULL,
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  from_user_id INT NOT NULL,
  to_user_id INT DEFAULT NULL,
  post_id INT NOT NULL,
  message TEXT DEFAULT NULL,
  status ENUM('sent', 'accepted', 'rejected', 'closed') DEFAULT 'sent',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_from_user (from_user_id),
  INDEX idx_to_user (to_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE community_groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  qr_code_url VARCHAR(500) DEFAULT NULL,
  status ENUM('published', 'offline') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  category ENUM('consulting', 'workshop', 'volunteer', 'project') DEFAULT 'volunteer',
  requirements TEXT DEFAULT NULL,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  status ENUM('published', 'offline') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE task_signups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('applied', 'approved', 'rejected', 'done') DEFAULT 'applied',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_task_user (task_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) DEFAULT NULL,
  role ENUM('admin', 'operator') DEFAULT 'operator',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE event_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  event_name VARCHAR(50) NOT NULL,
  properties LONGTEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event (event_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  operator_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INT NOT NULL,
  details LONGTEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS banners;

CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  url VARCHAR(500) DEFAULT NULL COMMENT '点击跳转链接',
  sort_order INT DEFAULT 0,
  status ENUM('published', 'offline') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admins (username, password, nickname, role) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3/ItB/XBG/eCknfIrqS6', '管理员', 'admin');

INSERT INTO community_groups (name, description, status) VALUES 
('新手群', '刚来河源的数字游民交流群', 'published'),
('活动群', '活动报名与通知群', 'published'),
('项目群', '本地项目协作群', 'published');

INSERT INTO packages (title, cover_url, price_min, price_max, tags, status) VALUES 
('河源数字游民7日体验包', '', 1500.00, 2500.00, '["体验", "短期", "含工位"]', 'published'),
('河源旅居月租套餐', '', 3500.00, 5500.00, '["长期", "住宿", "联合办公"]', 'published'),
('万绿湖畔深度旅居包', '', 4000.00, 6000.00, '["湖景", "安静", "品质"]', 'published');

INSERT INTO events (title, category, description, start_time, venue_name, capacity, fee_type, status) VALUES 
('周末咖啡品鉴会', 'social', '与志同道合的游民一起品鉴本地特色咖啡', DATE_ADD(NOW(), INTERVAL 3 DAY), '万绿湖咖啡厅', 20, 'free', 'published'),
('数字游民分享沙龙', 'skillshare', '邀请资深数字游民分享旅居经验', DATE_ADD(NOW(), INTERVAL 5 DAY), '河源联合办公空间', 30, 'free', 'published'),
('万绿湖徒步活动', 'outdoor', '探索河源最美湖泊风光', DATE_ADD(NOW(), INTERVAL 7 DAY), '万绿湖景区', 15, 'paid', 'published');

INSERT INTO pois (type, name, address, latitude, longitude, phone, status) VALUES 
('cowork', '河源联合办公空间', '河源市源城区建设大道', 23.7460, 114.6970, '0762-12345678', 'published'),
('stay', '万绿湖畔民宿', '河源市东源县万绿湖路', 23.7300, 114.7200, '0762-87654321', 'published'),
('food', '本地特色餐厅', '河源市源城区沿江路', 23.7450, 114.6980, NULL, 'published'),
('medical', '河源市人民医院', '河源市源城区文祥路', 23.7500, 114.7000, '0762-3322120', 'published'),
('transport', '河源火车站', '河源市源城区站前路', 23.7400, 114.6900, NULL, 'published');

INSERT INTO tasks (title, description, category, status) VALUES 
('社区活动志愿者招募', '协助组织周末社区活动', 'volunteer', 'published'),
('网站开发顾问', '为本地企业提供网站建设咨询', 'consulting', 'published'),
('摄影工作坊导师', '分享摄影技巧，带领户外拍摄', 'workshop', 'published');
