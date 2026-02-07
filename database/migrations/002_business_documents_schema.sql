-- MSME Funding Platform - Post-Login Schema Migration
-- This migration adds tables for businesses, documents, directors, and funding utilities

-- ============================================================================
-- 1. BUSINESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS businesses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id VARCHAR(255) NOT NULL,
  legal_name VARCHAR(500) NOT NULL,
  business_name VARCHAR(500),
  entity_type ENUM('SOLE_PROPRIETOR', 'PARTNERSHIP', 'PRIVATE_LIMITED', 'LLP', 'PUBLIC_LIMITED') NOT NULL,
  pan VARCHAR(10),
  gstin VARCHAR(15),
  udyam VARCHAR(50),
  sector VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  brief_description TEXT,
  profile_completion_percent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_owner (owner_id),
  INDEX idx_completion (profile_completion_percent),
  UNIQUE KEY uk_owner_business (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. DOCUMENT_GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS document_groups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  business_id BIGINT UNSIGNED NOT NULL,
  type ENUM('BS_PNL', 'SANCTION', 'PROFILE', 'KYC_DIRECTOR', 'ITR_DIRECTOR') NOT NULL,
  status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE') DEFAULT 'NOT_STARTED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE KEY uk_business_type (business_id, type),
  INDEX idx_business (business_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_group_id BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size_bytes BIGINT UNSIGNED NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_group_id) REFERENCES document_groups(id) ON DELETE CASCADE,
  INDEX idx_group (document_group_id),
  INDEX idx_uploaded (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. DIRECTORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS directors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  business_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  dob DATE,
  pan VARCHAR(10),
  aadhaar_number VARCHAR(255), -- Encrypted in application
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  INDEX idx_business (business_id),
  INDEX idx_pan (pan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. FUNDING_UTILITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS funding_utilities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  business_id BIGINT UNSIGNED NOT NULL,
  type ENUM('TERM_LOAN', 'WORKING_CAPITAL', 'ASSET_FINANCE', 'SCHEME_LOAN') NOT NULL,
  status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
  requested_amount DECIMAL(15, 2),
  tenure_months INT,
  purpose TEXT,
  security_type VARCHAR(100),
  security_available BOOLEAN DEFAULT FALSE,
  existing_emis DECIMAL(15, 2),
  frequency VARCHAR(50),
  asset_type VARCHAR(100),
  asset_cost DECIMAL(15, 2),
  schemes_interested TEXT, -- JSON string
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  INDEX idx_business (business_id),
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Note: To test with the demo user, you can insert a sample business:
-- INSERT INTO businesses (owner_id, legal_name, entity_type, sector, city, state, profile_completion_percent)
-- VALUES ('demo-user-id', 'Demo Business Pvt Ltd', 'PRIVATE_LIMITED', 'Technology', 'Mumbai', 'Maharashtra', 10);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables were created
-- SELECT TABLE_NAME, TABLE_ROWS 
-- FROM INFORMATION_SCHEMA.TABLES 
-- WHERE TABLE_SCHEMA = DATABASE() 
-- AND TABLE_NAME IN ('businesses', 'document_groups', 'documents', 'directors', 'funding_utilities');

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================

-- To remove all tables:
-- DROP TABLE IF EXISTS funding_utilities;
-- DROP TABLE IF EXISTS directors;
-- DROP TABLE IF EXISTS documents;
-- DROP TABLE IF EXISTS document_groups;
-- DROP TABLE IF EXISTS businesses;
