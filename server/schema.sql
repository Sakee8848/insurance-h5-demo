-- 物业保险AI服务核心数据库设计 (MySQL 8.0+)
-- 遵循《信息安全技术 个人信息安全规范》与等保三级要求

CREATE DATABASE IF NOT EXISTS `insur_ai_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `insur_ai_db`;

-- =============================================
-- 1. 基础权限与组织架构 (RBAC Model)
-- =============================================

-- 组织机构表 (41个区域公司)
CREATE TABLE `organizations` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL COMMENT '组织名称，如：北京区域公司',
    `code` VARCHAR(50) UNIQUE NOT NULL COMMENT '机构编码',
    `level` TINYINT DEFAULT 1 COMMENT '层级：1-总部, 2-区域',
    `parent_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '父级ID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='组织架构表';

-- 用户表 (敏感信息需加密存储)
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `org_id` BIGINT UNSIGNED NOT NULL COMMENT '所属机构',
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `real_name` VARCHAR(50) COMMENT '真实姓名',
    `role_type` ENUM('PROPERTY_MGR', 'BROKER', 'INSURER_CLAIM', 'ADMIN') NOT NULL COMMENT '角色类型',
    `phone_encrypted` VARCHAR(255) COMMENT '手机号(AES加密)',
    `status` TINYINT DEFAULT 1 COMMENT '1:启用, 0:禁用',
    `mfa_enabled` TINYINT DEFAULT 0 COMMENT '是否开启多因素认证',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_org` (`org_id`)
) ENGINE=InnoDB COMMENT='系统用户表';

-- =============================================
-- 2. 核心业务：保单与理赔 (Core Business)
-- =============================================

-- 保单主表
CREATE TABLE `policies` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `policy_no` VARCHAR(100) UNIQUE NOT NULL COMMENT '保单号',
    `holder_org_id` BIGINT UNSIGNED NOT NULL COMMENT '投保单位ID',
    `insurer_name` VARCHAR(100) NOT NULL COMMENT '承保公司',
    `insurance_type` VARCHAR(50) NOT NULL COMMENT '险种：财产险/公责险/雇主险/机器险',
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_premium` DECIMAL(14, 2) COMMENT '总保费',
    `file_url` VARCHAR(500) COMMENT '电子保单存储路径',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='保单信息表';

-- 理赔案件表 (核心业务表)
CREATE TABLE `claims` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `case_no` VARCHAR(64) UNIQUE NOT NULL COMMENT '案件号：CASE+日期+随机码',
    `policy_no` VARCHAR(100) NOT NULL COMMENT '关联保单号',
    `reporter_id` BIGINT UNSIGNED NOT NULL COMMENT '报案人ID',
    `occur_time` DATETIME NOT NULL COMMENT '出险时间',
    `occur_place` VARCHAR(255) COMMENT '出险地点',
    `risk_type` VARCHAR(50) COMMENT '风险类型：高空/水管/工伤',
    `status` ENUM('REPORTED', 'SURVEYING', 'DOC_SUBMITTED', 'AUDITING', 'PRE_PAYMENT', 'CLOSED') DEFAULT 'REPORTED',
    
    -- 预付赔款字段
    `is_pre_paid` TINYINT DEFAULT 0 COMMENT '是否触发预付',
    `pre_pay_amount` DECIMAL(14, 2) DEFAULT 0.00 COMMENT '预付金额',
    `final_pay_amount` DECIMAL(14, 2) DEFAULT 0.00 COMMENT '最终赔付金额',
    
    `ai_risk_score` DECIMAL(4, 2) COMMENT 'AI风险评分(0-10)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_policy` (`policy_no`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB COMMENT='理赔案件主表';

-- 理赔资料清单 (多模态文件)
CREATE TABLE `claim_documents` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `case_no` VARCHAR(64) NOT NULL,
    `file_type` ENUM('IMAGE', 'PDF', 'VIDEO') NOT NULL,
    `doc_category` VARCHAR(50) COMMENT '资料分类：发票/现场照/清单',
    `file_path` VARCHAR(500) NOT NULL COMMENT 'MinIO存储路径',
    `ocr_result` JSON COMMENT 'AI识别的结构化数据',
    `is_sensitive` TINYINT DEFAULT 0 COMMENT '是否包含敏感个人信息',
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_case` (`case_no`)
) ENGINE=InnoDB COMMENT='理赔资料表';

-- =============================================
-- 3. 安全合规：审计与知识库 (Security & Compliance)
-- =============================================

-- 安全审计日志 (不可篡改核心)
-- 建议使用对应数据库的"只读/WORM"存储介质备份此表
CREATE TABLE `audit_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED COMMENT '操作人ID',
    `user_name` VARCHAR(50) COMMENT '冗余用户名防删',
    `action` VARCHAR(50) NOT NULL COMMENT '操作：LOGIN/VIEW/EXPORT/DELETE',
    `target_resource` VARCHAR(255) COMMENT '操作对象：Claim:1001',
    `ip_address` VARCHAR(45) NOT NULL,
    `data_sensitivity` ENUM('NORMAL', 'SENSITIVE', 'CORE') DEFAULT 'NORMAL' COMMENT '数据敏感分级',
    `request_payload` JSON COMMENT '请求参数快照',
    `created_at` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) COMMENT '精确到毫秒的时间戳',
    INDEX `idx_time` (`created_at`),
    INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB COMMENT='系统安全审计日志';

-- 向量知识库分片索引 (配合 RAG)
CREATE TABLE `knowledge_chunks` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `source_doc_id` VARCHAR(100) COMMENT '来源文档ID',
    `chunk_content` TEXT NOT NULL COMMENT '文本切片内容',
    `vector_id` VARCHAR(64) NOT NULL COMMENT '向量数据库中的ID映射',
    `token_count` INT COMMENT 'Token数量',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='知识库切片索引';

