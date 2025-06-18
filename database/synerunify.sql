/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.0.99_synerunify
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : 192.168.0.99:30010
 Source Schema         : synerunify

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 18/06/2025 17:42:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for erp_customer
-- ----------------------------
DROP TABLE IF EXISTS `erp_customer`;
CREATE TABLE `erp_customer`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '客户ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '客户名称',
  `contact_person` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系人',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '电话',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '地址',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `tax_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '纳税人识别号',
  `tax_rate` int NULL DEFAULT NULL COMMENT '税率,精确到万分位',
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户行',
  `bank_account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '银行账号',
  `bank_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户地址',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '客户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_customer
-- ----------------------------
INSERT INTO `erp_customer` VALUES (1, '测试客户', '测试客户', '18888888777', '123@q.com', '高新区', 0, 0, 'x12334', 0, '中国银行', '12345678', '高新区', '测试', '0000', 1, 1, '2025-06-11 12:47:19', 1, '2025-06-11 12:49:07', b'0', 1);

-- ----------------------------
-- Table structure for erp_financial_record
-- ----------------------------
DROP TABLE IF EXISTS `erp_financial_record`;
CREATE TABLE `erp_financial_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '财务记录ID',
  `record_type` tinyint NOT NULL DEFAULT 0 COMMENT '记录类型 (0=income, 1=expense)',
  `amount` bigint NOT NULL COMMENT '金额',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `related_order_id` bigint NULL DEFAULT NULL COMMENT '关联订单ID',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '财务记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_financial_record
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inbound_order
-- ----------------------------
DROP TABLE IF EXISTS `erp_inbound_order`;
CREATE TABLE `erp_inbound_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '入库订单ID',
  `order_number` bigint NOT NULL COMMENT '订单编号',
  `purchase_id` bigint NULL DEFAULT NULL COMMENT '采购订单ID',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `inbound_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `discount_rate` bigint NULL DEFAULT 0 COMMENT '优惠率（百分比，1000表示10.00%）',
  `other_cost` bigint NULL DEFAULT 0 COMMENT '其他费用',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '入库订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inbound_order
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inbound_order_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_inbound_order_attachment`;
CREATE TABLE `erp_inbound_order_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '入库订单附件ID',
  `order_id` bigint NOT NULL COMMENT '入库订单ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '入库订单附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inbound_order_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inbound_order_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_inbound_order_detail`;
CREATE TABLE `erp_inbound_order_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '入库详情ID',
  `order_id` bigint NOT NULL COMMENT '入库订单ID',
  `purchase_detail_id` bigint NULL DEFAULT NULL COMMENT '采购订单详情ID',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `unit_price` bigint NOT NULL COMMENT '单价',
  `subtotal` bigint NOT NULL COMMENT '小计',
  `tax_rate` int NULL DEFAULT 0 COMMENT '税率,精确到万分位',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '入库详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inbound_order_detail
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inbound_record
-- ----------------------------
DROP TABLE IF EXISTS `erp_inbound_record`;
CREATE TABLE `erp_inbound_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '入库记录ID',
  `purchase_id` bigint NULL DEFAULT NULL COMMENT '采购订单ID',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '入库数量',
  `inbound_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '入库记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inbound_record
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inventory_check
-- ----------------------------
DROP TABLE IF EXISTS `erp_inventory_check`;
CREATE TABLE `erp_inventory_check`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '盘点记录ID',
  `warehouse_id` bigint NULL DEFAULT NULL COMMENT '仓库ID',
  `product_id` bigint NULL DEFAULT NULL COMMENT '产品ID',
  `checked_quantity` int NOT NULL COMMENT '盘点数量',
  `check_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '盘点日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '库存盘点表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inventory_check
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inventory_record
-- ----------------------------
DROP TABLE IF EXISTS `erp_inventory_record`;
CREATE TABLE `erp_inventory_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '库存记录ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  `quantity` int NOT NULL COMMENT '数量',
  `record_type` tinyint NOT NULL DEFAULT 0 COMMENT '记录类型 (0=in, 1=out)',
  `record_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '库存记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inventory_record
-- ----------------------------

-- ----------------------------
-- Table structure for erp_inventory_transfer
-- ----------------------------
DROP TABLE IF EXISTS `erp_inventory_transfer`;
CREATE TABLE `erp_inventory_transfer`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '调拨记录ID',
  `from_warehouse_id` bigint NULL DEFAULT NULL COMMENT '调出仓库ID',
  `to_warehouse_id` bigint NULL DEFAULT NULL COMMENT '调入仓库ID',
  `product_id` bigint NULL DEFAULT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '调拨数量',
  `transfer_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '调拨日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '库存调拨表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_inventory_transfer
-- ----------------------------

-- ----------------------------
-- Table structure for erp_outbound_order
-- ----------------------------
DROP TABLE IF EXISTS `erp_outbound_order`;
CREATE TABLE `erp_outbound_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '出库订单ID',
  `order_number` bigint NOT NULL COMMENT '订单编号',
  `sale_id` bigint NULL DEFAULT NULL COMMENT '销售订单ID',
  `customer_id` bigint NOT NULL COMMENT '客户ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `outbound_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '出库日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `discount_rate` bigint NULL DEFAULT 0 COMMENT '优惠率（百分比，1000表示10.00%）',
  `other_cost` bigint NULL DEFAULT 0 COMMENT '其他费用',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '出库订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_outbound_order
-- ----------------------------

-- ----------------------------
-- Table structure for erp_outbound_order_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_outbound_order_attachment`;
CREATE TABLE `erp_outbound_order_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '出库订单附件ID',
  `order_id` bigint NOT NULL COMMENT '出库订单ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '出库订单附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_outbound_order_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_outbound_order_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_outbound_order_detail`;
CREATE TABLE `erp_outbound_order_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '出库详情ID',
  `order_id` bigint NOT NULL COMMENT '出库订单ID',
  `sale_detail_id` bigint NULL DEFAULT NULL COMMENT '销售订单详情ID',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `unit_price` bigint NOT NULL COMMENT '单价',
  `subtotal` bigint NOT NULL COMMENT '小计',
  `tax_rate` int NULL DEFAULT 0 COMMENT '税率,精确到万分位',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '出库详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_outbound_order_detail
-- ----------------------------

-- ----------------------------
-- Table structure for erp_outbound_record
-- ----------------------------
DROP TABLE IF EXISTS `erp_outbound_record`;
CREATE TABLE `erp_outbound_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '出库记录ID',
  `order_id` bigint NULL DEFAULT NULL COMMENT '销售订单ID',
  `warehouse_id` bigint NULL DEFAULT NULL COMMENT '仓库ID',
  `product_id` bigint NULL DEFAULT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '出库数量',
  `outbound_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '出库日期',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '出库记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_outbound_record
-- ----------------------------

-- ----------------------------
-- Table structure for erp_payment
-- ----------------------------
DROP TABLE IF EXISTS `erp_payment`;
CREATE TABLE `erp_payment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '付款ID',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `user_id` bigint NOT NULL COMMENT '关联用户ID',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `amount` bigint NOT NULL COMMENT '付款金额',
  `discount_amount` bigint NULL DEFAULT 0 COMMENT '优惠金额',
  `payment_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '付款日期',
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '付款方式 (如 bank_transfer, cash, credit)',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `payment_status` tinyint NOT NULL DEFAULT 0 COMMENT '状态 (0=pending, 1=completed, 2=cancelled)',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '付款表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_payment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_payment_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_payment_attachment`;
CREATE TABLE `erp_payment_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `payment_id` bigint NOT NULL COMMENT '付款ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '付款附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_payment_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_payment_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_payment_detail`;
CREATE TABLE `erp_payment_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '付款详情ID',
  `payment_id` bigint NOT NULL COMMENT '付款ID',
  `purchase_order_id` bigint NULL DEFAULT NULL COMMENT '采购订单ID',
  `purchase_return_id` bigint NULL DEFAULT NULL COMMENT '采购退货ID',
  `amount` bigint NOT NULL COMMENT '金额',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '付款详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_payment_detail
-- ----------------------------

-- ----------------------------
-- Table structure for erp_product
-- ----------------------------
DROP TABLE IF EXISTS `erp_product`;
CREATE TABLE `erp_product`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '产品ID',
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '产品编码',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '产品名称',
  `category_id` bigint NULL DEFAULT NULL COMMENT '产品分类ID',
  `unit_id` bigint NULL DEFAULT NULL COMMENT '产品单位ID',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `barcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '条码',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '规格',
  `shelf_life_days` int NULL DEFAULT NULL COMMENT '保质期天数',
  `weight` int NULL DEFAULT NULL COMMENT '重量,kg,精确到百分位',
  `purchase_price` bigint NULL DEFAULT NULL COMMENT '采购价格',
  `sale_price` bigint NULL DEFAULT NULL COMMENT '销售价格',
  `min_price` bigint NULL DEFAULT NULL COMMENT '最低价格',
  `min_stock` int NOT NULL DEFAULT 0 COMMENT '最低库存',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_product
-- ----------------------------
INSERT INTO `erp_product` VALUES (1, 'test', '测试产品', NULL, NULL, 0, '', '1', 3, 1, 3, 3, 2, 1, '测试', 1, '2025-06-10 08:24:00', 1, '2025-06-10 08:24:00', b'0', 1);

-- ----------------------------
-- Table structure for erp_product_category
-- ----------------------------
DROP TABLE IF EXISTS `erp_product_category`;
CREATE TABLE `erp_product_category`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类编码',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父分类ID',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_product_category
-- ----------------------------
INSERT INTO `erp_product_category` VALUES (1, 'soft', '软件', 0, 0, 0, '软件', 1, '2025-06-10 05:40:10', 1, '2025-06-10 05:40:10', b'0', 1);
INSERT INTO `erp_product_category` VALUES (2, 'app', '应用软件', 1, 0, 0, '应用软件', 1, '2025-06-10 05:40:51', 1, '2025-06-10 05:40:51', b'0', 1);
INSERT INTO `erp_product_category` VALUES (3, 'buss', '商务软件', 1, 0, 2, '商务软件', 1, '2025-06-10 05:44:45', 1, '2025-06-10 05:44:45', b'0', 1);
INSERT INTO `erp_product_category` VALUES (4, 'f', '财务软件', 1, 0, 2, '财务软件', 1, '2025-06-10 05:45:05', 1, '2025-06-10 06:02:36', b'1', 1);

-- ----------------------------
-- Table structure for erp_product_inventory
-- ----------------------------
DROP TABLE IF EXISTS `erp_product_inventory`;
CREATE TABLE `erp_product_inventory`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '产品库存ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  `stock_quantity` int NOT NULL DEFAULT 0 COMMENT '库存数量',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品库存表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_product_inventory
-- ----------------------------

-- ----------------------------
-- Table structure for erp_product_unit
-- ----------------------------
DROP TABLE IF EXISTS `erp_product_unit`;
CREATE TABLE `erp_product_unit`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '单位ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '单位名称',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品单位表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_product_unit
-- ----------------------------
INSERT INTO `erp_product_unit` VALUES (1, 'kg', 0, 0, '重量', 1, '2025-06-10 06:45:31', 1, '2025-06-10 06:45:52', b'0', 1);
INSERT INTO `erp_product_unit` VALUES (2, 'g', 0, 0, '重量', 1, '2025-06-10 06:45:45', 1, '2025-06-10 06:45:45', b'0', 1);

-- ----------------------------
-- Table structure for erp_purchase_order
-- ----------------------------
DROP TABLE IF EXISTS `erp_purchase_order`;
CREATE TABLE `erp_purchase_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '采购订单ID',
  `order_number` bigint NOT NULL COMMENT '订单编号',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `purchase_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '采购日期',
  `total_amount` bigint NOT NULL COMMENT '总金额',
  `order_status` tinyint NOT NULL DEFAULT 0 COMMENT '订单状态 (0=pending, 1=completed, 2=cancelled)',
  `discount_rate` bigint NULL DEFAULT 0 COMMENT '优惠率（百分比，1000表示10.00%）',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `deposit` bigint NULL DEFAULT 0 COMMENT '定金',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_number`(`order_number` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '采购订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_purchase_order
-- ----------------------------
INSERT INTO `erp_purchase_order` VALUES (1, 59962819939930112, 1, 1, '2025-06-15 00:00:00', 100, 0, 1, 1, 10, '测试', '0000', 1, 1, '2025-06-15 11:10:53', 1, '2025-06-15 11:10:53', b'0', 1);
INSERT INTO `erp_purchase_order` VALUES (2, 59964807209553920, 1, 1, '2025-06-16 00:00:00', 100, 0, 1, 1, 5, '测试', '0000', 1, 1, '2025-06-15 11:18:47', 1, '2025-06-15 11:18:47', b'0', 1);
INSERT INTO `erp_purchase_order` VALUES (3, 59965337910644736, 1, 1, '2025-06-16 00:00:00', 1000, 0, 1, 1, 1000, '测试', '0000', 1, 1, '2025-06-15 11:20:53', 1, '2025-06-15 11:20:53', b'0', 1);
INSERT INTO `erp_purchase_order` VALUES (4, 59966267620069376, 1, 1, '2025-06-15 00:00:00', 16643, 0, 1, 1, 12, '1', '0000', 1, 1, '2025-06-15 11:24:35', 1, '2025-06-15 11:24:35', b'0', 1);
INSERT INTO `erp_purchase_order` VALUES (6, 59969975170895872, 1, 1, '2025-06-16 00:00:00', 1232, 0, 1, 1, 123, '测试', '0000', 1, 1, '2025-06-15 11:39:19', 1, '2025-06-15 11:39:19', b'0', 1);

-- ----------------------------
-- Table structure for erp_purchase_order_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_purchase_order_attachment`;
CREATE TABLE `erp_purchase_order_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `purchase_id` bigint NOT NULL COMMENT '采购订单ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '采购订单附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_purchase_order_attachment
-- ----------------------------
INSERT INTO `erp_purchase_order_attachment` VALUES (2, 6, 42, NULL, '0000', 1, 1, '2025-06-15 11:39:19', 1, '2025-06-15 11:39:19', b'0', 1);

-- ----------------------------
-- Table structure for erp_purchase_order_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_purchase_order_detail`;
CREATE TABLE `erp_purchase_order_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '采购订单详情ID',
  `purchase_id` bigint NOT NULL COMMENT '采购订单ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `unit_price` bigint NOT NULL COMMENT '单价',
  `subtotal` bigint NOT NULL COMMENT '小计',
  `tax_rate` int NULL DEFAULT 0 COMMENT '税率,精确到万分位',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '采购订单详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_purchase_order_detail
-- ----------------------------
INSERT INTO `erp_purchase_order_detail` VALUES (2, 6, 1, 2, 60, 120, 1, '测试', '0000', 1, 1, '2025-06-15 11:39:19', 1, '2025-06-15 11:39:19', b'0', 1);

-- ----------------------------
-- Table structure for erp_purchase_return
-- ----------------------------
DROP TABLE IF EXISTS `erp_purchase_return`;
CREATE TABLE `erp_purchase_return`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '退货ID',
  `purchase_order_id` bigint NULL DEFAULT NULL COMMENT '采购订单ID',
  `supplier_id` bigint NULL DEFAULT NULL COMMENT '供应商ID',
  `warehouse_id` bigint NULL DEFAULT NULL COMMENT '仓库ID',
  `return_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '退货日期',
  `total_amount` bigint NOT NULL COMMENT '退货总金额',
  `return_status` tinyint NOT NULL DEFAULT 0 COMMENT '状态 (0=pending, 1=completed, 2=cancelled)',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '采购退货表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_purchase_return
-- ----------------------------

-- ----------------------------
-- Table structure for erp_receipt
-- ----------------------------
DROP TABLE IF EXISTS `erp_receipt`;
CREATE TABLE `erp_receipt`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收款ID',
  `customer_id` bigint NOT NULL COMMENT '客户ID',
  `user_id` bigint NOT NULL COMMENT '关联用户ID',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `amount` bigint NOT NULL COMMENT '收款金额',
  `discount_amount` bigint NULL DEFAULT 0 COMMENT '优惠金额',
  `receipt_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款日期',
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '收款方式 (如 bank_transfer, cash, credit)',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `receipt_status` tinyint NOT NULL DEFAULT 0 COMMENT '状态 (0=pending, 1=completed, 2=cancelled)',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收款表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_receipt
-- ----------------------------

-- ----------------------------
-- Table structure for erp_receipt_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_receipt_attachment`;
CREATE TABLE `erp_receipt_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `receipt_id` bigint NOT NULL COMMENT '收款ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收款附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_receipt_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_receipt_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_receipt_detail`;
CREATE TABLE `erp_receipt_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收款详情ID',
  `receipt_id` bigint NOT NULL COMMENT '收款ID',
  `sales_order_id` bigint NULL DEFAULT NULL COMMENT '销售订单ID',
  `sales_return_id` bigint NULL DEFAULT NULL COMMENT '销售退货ID',
  `amount` bigint NOT NULL COMMENT '金额',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收款详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_receipt_detail
-- ----------------------------

-- ----------------------------
-- Table structure for erp_sales_order
-- ----------------------------
DROP TABLE IF EXISTS `erp_sales_order`;
CREATE TABLE `erp_sales_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_number` bigint NOT NULL COMMENT '订单编号',
  `customer_id` bigint NOT NULL COMMENT '客户ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单日期',
  `total_amount` bigint NOT NULL COMMENT '总金额',
  `order_status` tinyint NOT NULL DEFAULT 0 COMMENT '订单状态 (0=pending, 1=completed, 2=cancelled)',
  `discount_rate` bigint NULL DEFAULT 0 COMMENT '优惠率（百分比，1000表示10.00%）',
  `settlement_account_id` bigint NULL DEFAULT NULL COMMENT '结算账户ID',
  `deposit` bigint NULL DEFAULT 0 COMMENT '定金',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_number`(`order_number` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '销售订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_sales_order
-- ----------------------------

-- ----------------------------
-- Table structure for erp_sales_order_attachment
-- ----------------------------
DROP TABLE IF EXISTS `erp_sales_order_attachment`;
CREATE TABLE `erp_sales_order_attachment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `order_id` bigint NOT NULL COMMENT '销售订单ID',
  `file_id` bigint NOT NULL COMMENT '文件ID',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '销售订单附件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_sales_order_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for erp_sales_order_detail
-- ----------------------------
DROP TABLE IF EXISTS `erp_sales_order_detail`;
CREATE TABLE `erp_sales_order_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单详情ID',
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `unit_price` bigint NOT NULL COMMENT '单价',
  `subtotal` bigint NOT NULL COMMENT '小计',
  `tax_rate` int NULL DEFAULT NULL COMMENT '税率,精确到万分位',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '销售订单详情表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_sales_order_detail
-- ----------------------------

-- ----------------------------
-- Table structure for erp_sales_return
-- ----------------------------
DROP TABLE IF EXISTS `erp_sales_return`;
CREATE TABLE `erp_sales_return`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '退货ID',
  `sales_order_id` bigint NULL DEFAULT NULL COMMENT '销售订单ID',
  `customer_id` bigint NULL DEFAULT NULL COMMENT '客户ID',
  `warehouse_id` bigint NULL DEFAULT NULL COMMENT '仓库ID',
  `return_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '退货日期',
  `total_amount` bigint NOT NULL COMMENT '退货总金额',
  `return_status` tinyint NOT NULL DEFAULT 0 COMMENT '状态 (0=pending, 1=completed, 2=cancelled)',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '销售退货表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_sales_return
-- ----------------------------

-- ----------------------------
-- Table structure for erp_settlement_account
-- ----------------------------
DROP TABLE IF EXISTS `erp_settlement_account`;
CREATE TABLE `erp_settlement_account`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '账户ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账户名称',
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户行',
  `bank_account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '银行账号',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '结算账户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_settlement_account
-- ----------------------------
INSERT INTO `erp_settlement_account` VALUES (1, '测试账户', '中国银行', '1234567890', 0, 0, '测试账户', 1, '2025-06-10 14:25:49', 1, '2025-06-10 14:28:16', b'0', 1);

-- ----------------------------
-- Table structure for erp_supplier
-- ----------------------------
DROP TABLE IF EXISTS `erp_supplier`;
CREATE TABLE `erp_supplier`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商名称',
  `contact_person` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系人',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '电话',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '地址',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `tax_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '纳税人识别号',
  `tax_rate` int NULL DEFAULT NULL COMMENT '税率,精确到万分位',
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户行',
  `bank_account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '银行账号',
  `bank_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户地址',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '供应商信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_supplier
-- ----------------------------
INSERT INTO `erp_supplier` VALUES (1, '测试供应商', '测试', '18888888777', '123@q.com', '高新区', 0, 'x12334', 13, '中国银行', '12345678', '高新区', '测试', 0, 1, '2025-06-10 14:48:11', 1, '2025-06-10 14:50:04', b'0', 1);

-- ----------------------------
-- Table structure for erp_warehouse
-- ----------------------------
DROP TABLE IF EXISTS `erp_warehouse`;
CREATE TABLE `erp_warehouse`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '仓库ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '仓库名称',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '仓库位置',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `storage_fee` bigint NULL DEFAULT NULL COMMENT '仓储费',
  `handling_fee` bigint NULL DEFAULT NULL COMMENT '搬运费',
  `manager` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '负责人',
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '仓库信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of erp_warehouse
-- ----------------------------
INSERT INTO `erp_warehouse` VALUES (1, '测试仓库', '高新区123', 0, 1, 10, 100, '测试负责人', '测试', 1, '2025-06-09 14:10:17', 1, '2025-06-09 14:17:59', b'0', 1);

-- ----------------------------
-- Table structure for system_data_scope_rule
-- ----------------------------
DROP TABLE IF EXISTS `system_data_scope_rule`;
CREATE TABLE `system_data_scope_rule`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` tinyint NOT NULL COMMENT '规则类型（0系统定义 1自定义）',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则名称',
  `field` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '规则字段',
  `condition` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '规则条件',
  `value` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '规则值',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '数据权限规则表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_data_scope_rule
-- ----------------------------
INSERT INTO `system_data_scope_rule` VALUES (1, 0, '全部数据权限', NULL, NULL, NULL, 1, '2025-05-14 14:03:34', 1, '2025-05-14 14:04:27', b'0', 1);
INSERT INTO `system_data_scope_rule` VALUES (2, 0, '本部门数据权限', NULL, NULL, NULL, 1, '2025-05-14 14:06:26', 1, '2025-05-14 14:06:26', b'0', 1);
INSERT INTO `system_data_scope_rule` VALUES (3, 0, '本部门及以下数据权限', NULL, NULL, NULL, 1, '2025-05-14 14:06:49', 1, '2025-05-14 14:06:49', b'0', 1);
INSERT INTO `system_data_scope_rule` VALUES (4, 0, '仅本人数据权限', NULL, NULL, NULL, 1, '2025-05-14 14:07:06', 1, '2025-05-14 14:07:18', b'0', 1);
INSERT INTO `system_data_scope_rule` VALUES (5, 0, '指定部门数据权限', NULL, NULL, NULL, 1, '2025-05-14 14:07:38', 1, '2025-05-14 14:07:38', b'0', 1);

-- ----------------------------
-- Table structure for system_department
-- ----------------------------
DROP TABLE IF EXISTS `system_department`;
CREATE TABLE `system_department`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门名称',
  `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '父部门id',
  `sort` int NOT NULL DEFAULT 0 COMMENT '显示顺序',
  `leader_user_id` bigint NULL DEFAULT NULL COMMENT '负责人',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `status` tinyint NOT NULL COMMENT '部门状态（0正常 1停用）',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '部门表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_department
-- ----------------------------
INSERT INTO `system_department` VALUES (1, '0000', '总部', 0, 1, 1, '18888888888', '123@qq.com', 0, 1, '2025-03-08 10:04:46', 1, '2025-05-17 12:35:29', b'0', 1);
INSERT INTO `system_department` VALUES (7, '0000-0000', '测试租户', 1, 0, NULL, NULL, NULL, 0, 1, '2025-05-23 08:16:00', 1, '2025-05-23 08:16:00', b'0', 2);

-- ----------------------------
-- Table structure for system_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `system_dict_data`;
CREATE TABLE `system_dict_data`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `sort` int NOT NULL DEFAULT 0 COMMENT '字典排序',
  `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '字典标签',
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '字典键值',
  `dict_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '字典类型',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态（0正常 1停用）',
  `color_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '颜色类型',
  `css_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'css 样式',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '字典数据表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_dict_data
-- ----------------------------
INSERT INTO `system_dict_data` VALUES (2, 0, '男', '0', 'sex', 0, '', '', '男', 1, '2025-04-28 09:26:26', 1, '2025-05-23 06:49:20', b'0');
INSERT INTO `system_dict_data` VALUES (3, 1, '女', '1', 'sex', 0, '', '', '女', 1, '2025-04-29 01:30:04', 1, '2025-04-29 01:30:04', b'0');
INSERT INTO `system_dict_data` VALUES (4, 0, '目录', '1', 'menu_type', 0, '', '', '目录', 1, '2025-04-29 01:31:29', 1, '2025-05-12 06:46:44', b'0');
INSERT INTO `system_dict_data` VALUES (5, 1, '菜单', '2', 'menu_type', 0, '', '', '菜单', 1, '2025-04-29 01:31:41', 1, '2025-05-12 06:46:45', b'0');
INSERT INTO `system_dict_data` VALUES (6, 2, '操作', '3', 'menu_type', 0, '', '', '操作', 1, '2025-04-29 01:31:58', 1, '2025-05-14 01:13:31', b'0');
INSERT INTO `system_dict_data` VALUES (7, 0, '正常', '0', 'status', 0, '', '', '正常', 1, '2025-04-29 01:38:14', 1, '2025-05-14 01:13:32', b'0');
INSERT INTO `system_dict_data` VALUES (8, 1, '停用', '1', 'status', 0, '', '', '停用', 1, '2025-04-29 01:38:39', 1, '2025-04-29 01:38:39', b'0');
INSERT INTO `system_dict_data` VALUES (9, 0, '未删除', '0', 'deleted', 0, '', '', '未删除', 1, '2025-04-30 07:04:27', 1, '2025-04-30 07:04:27', b'0');
INSERT INTO `system_dict_data` VALUES (10, 1, '已删除', '1', 'deleted', 0, '', '', '已删除', 1, '2025-04-30 07:04:39', 1, '2025-04-30 07:04:39', b'0');
INSERT INTO `system_dict_data` VALUES (11, 0, '内置', '0', 'role_type', 0, '', '', '内置', 1, '2025-05-14 09:30:31', 1, '2025-05-14 14:04:45', b'0');
INSERT INTO `system_dict_data` VALUES (12, 0, '自定义', '1', 'role_type', 0, '', '', '自定义', 1, '2025-05-14 09:30:43', 1, '2025-05-14 14:04:52', b'0');
INSERT INTO `system_dict_data` VALUES (13, 0, '已下单', '0', 'purchase_order_status', 0, '', '', '已下单', 1, '2025-06-12 02:32:39', 1, '2025-06-12 02:32:39', b'0');
INSERT INTO `system_dict_data` VALUES (14, 1, '待入库', '1', 'purchase_order_status', 0, '', '', '待入库', 1, '2025-06-12 02:34:21', 1, '2025-06-12 02:34:21', b'0');
INSERT INTO `system_dict_data` VALUES (15, 2, '已完成', '2', 'purchase_order_status', 0, '', '', '已完成', 1, '2025-06-12 02:35:03', 1, '2025-06-12 02:35:03', b'0');
INSERT INTO `system_dict_data` VALUES (16, 3, '已取消', '3', 'purchase_order_status', 0, '', '', '已取消', 1, '2025-06-12 02:35:19', 1, '2025-06-12 02:35:19', b'0');
INSERT INTO `system_dict_data` VALUES (17, 0, '已下单', '0', 'sale_order_status', 0, '', '', '已下单', 1, '2025-06-12 02:37:14', 1, '2025-06-12 02:37:14', b'0');
INSERT INTO `system_dict_data` VALUES (18, 1, '待出库', '1', 'sale_order_status', 0, '', '', '待出库', 1, '2025-06-12 02:39:57', 1, '2025-06-12 02:39:57', b'0');
INSERT INTO `system_dict_data` VALUES (19, 2, '待签收', '2', 'sale_order_status', 0, '', '', '待签收', 1, '2025-06-12 02:40:41', 1, '2025-06-12 02:40:41', b'0');
INSERT INTO `system_dict_data` VALUES (20, 3, '已签收', '3', 'sale_order_status', 0, '', '', '已签收', 1, '2025-06-12 02:40:56', 1, '2025-06-12 02:40:56', b'0');
INSERT INTO `system_dict_data` VALUES (21, 4, '已完成', '4', 'sale_order_status', 0, '', '', '已完成', 1, '2025-06-12 02:41:09', 1, '2025-06-12 02:41:09', b'0');
INSERT INTO `system_dict_data` VALUES (22, 5, '已取消', '5', 'sale_order_status', 0, '', '', '已取消', 1, '2025-06-12 02:41:21', 1, '2025-06-12 02:41:21', b'0');
INSERT INTO `system_dict_data` VALUES (23, 6, '退货处理中', '6', 'sale_order_status', 0, '', '', '退货处理中', 1, '2025-06-12 02:41:33', 1, '2025-06-12 02:41:33', b'0');
INSERT INTO `system_dict_data` VALUES (24, 7, '退货完成', '7', 'sale_order_status', 0, '', '', '退货完成', 1, '2025-06-12 02:41:43', 1, '2025-06-12 02:41:43', b'0');

-- ----------------------------
-- Table structure for system_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `system_dict_type`;
CREATE TABLE `system_dict_type`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '字典名称',
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '字典类型',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '字典类型表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_dict_type
-- ----------------------------
INSERT INTO `system_dict_type` VALUES (1, '性别', 'sex', 0, '性别', 1, '2025-04-28 07:02:02', 1, '2025-04-28 07:02:02', b'0');
INSERT INTO `system_dict_type` VALUES (2, '菜单类型', 'menu_type', 0, '菜单类型', 1, '2025-04-28 07:23:37', 1, '2025-04-28 07:23:37', b'0');
INSERT INTO `system_dict_type` VALUES (3, '状态', 'status', 0, '状态', 1, '2025-04-29 01:37:35', 1, '2025-04-29 01:37:35', b'0');
INSERT INTO `system_dict_type` VALUES (4, '是否删除', 'deleted', 0, '是否删除', 1, '2025-04-30 07:04:05', 1, '2025-04-30 07:04:05', b'0');
INSERT INTO `system_dict_type` VALUES (5, '角色类型', 'role_type', 0, '角色类型', 1, '2025-05-14 09:29:30', 1, '2025-05-14 09:29:30', b'0');
INSERT INTO `system_dict_type` VALUES (6, '采购订单状态', 'purchase_order_status', 0, '采购订单状态', 1, '2025-06-12 02:21:28', 1, '2025-06-12 02:30:59', b'0');
INSERT INTO `system_dict_type` VALUES (7, '销售订单状态', 'sale_order_status', 0, '销售订单状态', 1, '2025-06-12 02:36:31', 1, '2025-06-12 02:36:31', b'0');

-- ----------------------------
-- Table structure for system_file
-- ----------------------------
DROP TABLE IF EXISTS `system_file`;
CREATE TABLE `system_file`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件名',
  `file_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '文件类型',
  `file_size` bigint NOT NULL COMMENT '文件大小（字节）',
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件存储路径',
  `status` tinyint NOT NULL COMMENT '状态',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者ID',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文件信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_file
-- ----------------------------
INSERT INTO `system_file` VALUES (1, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59861365463977984_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 04:27:44', 1, '2025-06-15 04:27:44', b'0', 1);
INSERT INTO `system_file` VALUES (2, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59872828287094784_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 05:13:17', 1, '2025-06-15 05:13:17', b'0', 1);
INSERT INTO `system_file` VALUES (3, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59880014488801280_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 05:41:50', 1, '2025-06-15 05:41:50', b'0', 1);
INSERT INTO `system_file` VALUES (4, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59881350756306944_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 05:47:09', 1, '2025-06-15 05:47:09', b'0', 1);
INSERT INTO `system_file` VALUES (5, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59893421816418304_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 06:35:07', 1, '2025-06-15 06:35:07', b'0', 1);
INSERT INTO `system_file` VALUES (6, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59921757091401728_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:27:43', 1, '2025-06-15 08:27:43', b'0', 1);
INSERT INTO `system_file` VALUES (7, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59921798560485376_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:27:53', 1, '2025-06-15 08:27:53', b'0', 1);
INSERT INTO `system_file` VALUES (8, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59923237097705472_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:33:36', 1, '2025-06-15 08:33:36', b'0', 1);
INSERT INTO `system_file` VALUES (9, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59924312458530816_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:37:52', 1, '2025-06-15 08:37:52', b'0', 1);
INSERT INTO `system_file` VALUES (10, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59927456680775680_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:50:22', 1, '2025-06-15 08:50:22', b'0', 1);
INSERT INTO `system_file` VALUES (11, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59929011249221632_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:56:32', 1, '2025-06-15 08:56:32', b'0', 1);
INSERT INTO `system_file` VALUES (12, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59929077015908352_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 08:56:48', 1, '2025-06-15 08:56:48', b'0', 1);
INSERT INTO `system_file` VALUES (13, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59929096708165632_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 08:56:53', 1, '2025-06-15 08:56:53', b'0', 1);
INSERT INTO `system_file` VALUES (14, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59930505470021632_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:02:29', 1, '2025-06-15 09:02:29', b'0', 1);
INSERT INTO `system_file` VALUES (15, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59931697700933632_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:07:13', 1, '2025-06-15 09:07:13', b'0', 1);
INSERT INTO `system_file` VALUES (16, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59931974495637504_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:08:19', 1, '2025-06-15 09:08:19', b'0', 1);
INSERT INTO `system_file` VALUES (17, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59935301769891840_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:21:32', 1, '2025-06-15 09:21:32', b'0', 1);
INSERT INTO `system_file` VALUES (18, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59935741282619392_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 09:23:17', 1, '2025-06-15 09:23:17', b'0', 1);
INSERT INTO `system_file` VALUES (19, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59935817757364224_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:23:35', 1, '2025-06-15 09:23:35', b'0', 1);
INSERT INTO `system_file` VALUES (20, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59939261842984960_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:37:16', 1, '2025-06-15 09:37:16', b'0', 1);
INSERT INTO `system_file` VALUES (21, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59940126351953920_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 09:40:42', 1, '2025-06-15 09:40:42', b'0', 1);
INSERT INTO `system_file` VALUES (22, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59940167456133120_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:40:52', 1, '2025-06-15 09:40:52', b'0', 1);
INSERT INTO `system_file` VALUES (23, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59941100063821824_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:44:35', 1, '2025-06-15 09:44:35', b'0', 1);
INSERT INTO `system_file` VALUES (24, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59941106665656320_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 09:44:36', 1, '2025-06-15 09:44:36', b'0', 1);
INSERT INTO `system_file` VALUES (25, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59942054226038784_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:48:22', 1, '2025-06-15 09:48:22', b'0', 1);
INSERT INTO `system_file` VALUES (26, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59942060848844800_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 09:48:24', 1, '2025-06-15 09:48:24', b'0', 1);
INSERT INTO `system_file` VALUES (27, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59942071024226304_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 09:48:26', 1, '2025-06-15 09:48:26', b'0', 1);
INSERT INTO `system_file` VALUES (28, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59945104915304448_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 10:00:29', 1, '2025-06-15 10:00:29', b'0', 1);
INSERT INTO `system_file` VALUES (29, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59945121612828672_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 10:00:33', 1, '2025-06-15 10:00:33', b'0', 1);
INSERT INTO `system_file` VALUES (30, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59947283143200768_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 10:09:09', 1, '2025-06-15 10:09:09', b'0', 1);
INSERT INTO `system_file` VALUES (31, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59947824841756672_增值税发票1.jpg', 0, '0000', 1, 1, '2025-06-15 10:11:18', 1, '2025-06-15 10:11:18', b'0', 1);
INSERT INTO `system_file` VALUES (32, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59953719759867904_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 10:34:43', 1, '2025-06-15 10:34:43', b'0', 1);
INSERT INTO `system_file` VALUES (33, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59953997909331968_增值税发票1.jpg', 1, '0000', 1, 1, '2025-06-15 10:35:50', 1, '2025-06-15 10:35:50', b'0', 1);
INSERT INTO `system_file` VALUES (34, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59954924984733696_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 10:39:31', 1, '2025-06-15 10:39:31', b'0', 1);
INSERT INTO `system_file` VALUES (35, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59955310621626368_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 10:41:03', 1, '2025-06-15 10:41:03', b'0', 1);
INSERT INTO `system_file` VALUES (36, '增值税发票1.jpg', 'image/jpeg', 84093, '2025/06/15/59955511944024064_增值税发票1.jpg', 1, '0000', 1, 1, '2025-06-15 10:41:51', 1, '2025-06-15 10:41:51', b'0', 1);
INSERT INTO `system_file` VALUES (37, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59957577886208000_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 10:50:03', 1, '2025-06-15 10:50:03', b'0', 1);
INSERT INTO `system_file` VALUES (38, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59960339877335040_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 11:01:02', 1, '2025-06-15 11:01:02', b'0', 1);
INSERT INTO `system_file` VALUES (39, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59964800213454848_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 11:18:45', 1, '2025-06-15 11:18:45', b'0', 1);
INSERT INTO `system_file` VALUES (40, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59965326640549888_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 11:20:51', 1, '2025-06-15 11:20:51', b'0', 1);
INSERT INTO `system_file` VALUES (41, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59966263547400192_增值税发票.jpg', 1, '0000', 1, 1, '2025-06-15 11:24:34', 1, '2025-06-15 11:24:34', b'0', 1);
INSERT INTO `system_file` VALUES (42, '增值税发票.jpg', 'image/jpeg', 84093, '2025/06/15/59967445963640832_增值税发票.jpg', 0, '0000', 1, 1, '2025-06-15 11:29:16', 1, '2025-06-15 11:39:19', b'0', 1);

-- ----------------------------
-- Table structure for system_menu
-- ----------------------------
DROP TABLE IF EXISTS `system_menu`;
CREATE TABLE `system_menu`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `permission` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限标识',
  `type` tinyint NOT NULL COMMENT '菜单类型',
  `sort` int NOT NULL DEFAULT 0 COMMENT '显示顺序',
  `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '父菜单ID',
  `path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '路由地址',
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '#' COMMENT '菜单图标',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '组件路径',
  `component_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '组件名',
  `i18n` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '国际化',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '菜单状态',
  `visible` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否可见',
  `keep_alive` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否缓存',
  `always_show` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否总是显示',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 161 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_menu
-- ----------------------------
INSERT INTO `system_menu` VALUES (1, '仪表盘', '', 2, 50, 0, '/dashboard', 'dashboard', 'pages/Dashboard', 'Dashboard', 'global.menu.dashboard', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-06-04 01:37:27', b'0');
INSERT INTO `system_menu` VALUES (2, '系统管理', '', 1, 100, 0, '/system', 'system', NULL, NULL, 'global.menu.system', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-06-04 01:10:34', b'0');
INSERT INTO `system_menu` VALUES (3, '配置管理', '', 1, 200, 0, '/config', 'config', NULL, NULL, 'global.menu.config', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-06-04 01:10:47', b'0');
INSERT INTO `system_menu` VALUES (6, '支付管理', '', 1, 400, 0, '/pay', 'pay', '', '', 'global.menu.pay', 0, b'1', b'1', b'1', 1, '2025-05-12 00:53:57', 1, '2025-06-04 01:11:07', b'1');
INSERT INTO `system_menu` VALUES (7, '用户管理', 'user', 2, 102, 2, '/system/user', 'user', 'pages/system/UserManage', 'UserManage', 'global.menu.user', 0, b'1', b'1', b'1', 1, '2025-05-12 00:54:51', 1, '2025-06-04 01:11:13', b'0');
INSERT INTO `system_menu` VALUES (10, '部门管理', 'department', 2, 103, 2, '/system/department', 'department', 'pages/system/DepartmentManage', 'DepartmentManage', 'global.menu.department', 0, b'1', b'1', b'1', 1, '2025-05-14 06:31:37', 1, '2025-06-04 01:11:17', b'0');
INSERT INTO `system_menu` VALUES (11, '租户管理', '', 1, 101, 2, '/system/tenant', 'tenant', '', '', 'global.menu.tenant', 0, b'1', b'0', b'1', 1, '2025-05-14 06:41:40', 1, '2025-06-04 01:11:29', b'0');
INSERT INTO `system_menu` VALUES (12, '角色管理', 'role', 2, 104, 2, '/system/role', 'role', 'pages/system/RoleManage', 'RoleManage', 'global.menu.role', 0, b'1', b'1', b'1', 1, '2025-05-14 06:42:15', 1, '2025-06-04 01:11:39', b'0');
INSERT INTO `system_menu` VALUES (13, '租户套餐', 'tenant:package', 2, 102, 11, '/system/tenant/package', 'tenant_package', 'pages/system/tenant/TenantPackageManage', 'TenantPackageManage', 'global.menu.tenant.package', 0, b'1', b'1', b'1', 1, '2025-05-15 14:08:27', 1, '2025-06-04 01:11:46', b'0');
INSERT INTO `system_menu` VALUES (14, '租户列表', 'tenant:list', 2, 103, 11, '/system/tenant/list', 'tenant_list', 'pages/system/tenant/TenantListManage', 'TenantListManage', 'global.menu.tenant.list', 0, b'1', b'1', b'1', 1, '2025-05-15 14:09:52', 1, '2025-06-04 01:11:52', b'0');
INSERT INTO `system_menu` VALUES (18, '菜单管理', 'menu', 2, 201, 3, '/config/menu', 'menu', 'pages/config/MenuManage', 'MenuManage', 'global.menu.menu', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-06-04 01:11:59', b'0');
INSERT INTO `system_menu` VALUES (19, '字典管理', 'dict', 2, 202, 3, '/config/dict', 'dict', 'pages/config/DictManage', 'DictManage', 'global.menu.dict', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-06-04 01:12:08', b'0');
INSERT INTO `system_menu` VALUES (21, '岗位管理', 'post', 2, 105, 2, '/system/post', 'post', 'pages/system/PostManage', 'PostManage', 'global.menu.post', 0, b'1', b'1', b'1', 1, '2025-05-18 07:22:36', 1, '2025-06-04 01:12:11', b'0');
INSERT INTO `system_menu` VALUES (25, '查看', 'system:user:get', 3, 0, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:52:33', 1, '2025-05-23 01:52:33', b'0');
INSERT INTO `system_menu` VALUES (26, '新增', 'system:user:add', 3, 1, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:52:46', 1, '2025-05-23 01:52:46', b'0');
INSERT INTO `system_menu` VALUES (27, '修改', 'system:user:edit', 3, 2, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:53:01', 1, '2025-05-23 01:53:01', b'0');
INSERT INTO `system_menu` VALUES (28, '删除', 'system:user:delete', 3, 3, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:53:13', 1, '2025-05-23 01:53:13', b'0');
INSERT INTO `system_menu` VALUES (29, '查看', 'system:department:get', 3, 0, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:53:41', 1, '2025-05-23 01:54:35', b'0');
INSERT INTO `system_menu` VALUES (30, '新增', 'system:department:add', 3, 1, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:54:01', 1, '2025-05-23 01:54:01', b'0');
INSERT INTO `system_menu` VALUES (31, '修改', 'system:department:edit', 3, 2, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:54:11', 1, '2025-05-23 01:54:11', b'0');
INSERT INTO `system_menu` VALUES (32, '删除', 'system:department:delete', 3, 3, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:54:23', 1, '2025-05-23 01:54:23', b'0');
INSERT INTO `system_menu` VALUES (33, '查看', 'system:role:get', 3, 0, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:56:15', 1, '2025-05-23 01:56:15', b'0');
INSERT INTO `system_menu` VALUES (34, '新增', 'system:role:add', 3, 1, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:56:23', 1, '2025-05-23 01:56:23', b'0');
INSERT INTO `system_menu` VALUES (35, '修改', 'system:role:edit', 3, 2, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:56:34', 1, '2025-05-23 01:56:34', b'0');
INSERT INTO `system_menu` VALUES (36, '删除', 'system:role:delete', 3, 3, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:56:44', 1, '2025-05-23 01:56:44', b'0');
INSERT INTO `system_menu` VALUES (37, '查看', 'system:post:get', 3, 0, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:57:10', 1, '2025-05-23 01:57:10', b'0');
INSERT INTO `system_menu` VALUES (38, '新增', 'system:post:add', 3, 1, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:57:20', 1, '2025-05-23 01:57:20', b'0');
INSERT INTO `system_menu` VALUES (39, '修改', 'system:post:edit', 3, 2, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:57:32', 1, '2025-05-23 01:57:32', b'0');
INSERT INTO `system_menu` VALUES (40, '删除', 'system:post:delete', 3, 3, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:57:42', 1, '2025-05-23 01:57:42', b'0');
INSERT INTO `system_menu` VALUES (41, '查看', 'system:tenant:package:get', 3, 0, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:58:07', 1, '2025-05-23 01:58:07', b'0');
INSERT INTO `system_menu` VALUES (42, '新增', 'system:tenant:package:add', 3, 1, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:58:16', 1, '2025-05-23 01:58:16', b'0');
INSERT INTO `system_menu` VALUES (43, '修改', 'system:tenant:package:edit', 3, 2, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:58:27', 1, '2025-05-23 01:58:27', b'0');
INSERT INTO `system_menu` VALUES (44, '删除', 'system:tenant:package:delete', 3, 3, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:58:38', 1, '2025-05-23 01:58:38', b'0');
INSERT INTO `system_menu` VALUES (45, '查看', 'system:tenant:list:get', 3, 0, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:58:52', 1, '2025-05-23 02:54:53', b'0');
INSERT INTO `system_menu` VALUES (46, '新增', 'system:tenant:list:add', 3, 1, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:59:01', 1, '2025-05-23 02:55:00', b'0');
INSERT INTO `system_menu` VALUES (47, '修改', 'system:tenant:list:edit', 3, 2, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:59:12', 1, '2025-05-23 02:55:06', b'0');
INSERT INTO `system_menu` VALUES (48, '删除', 'system:tenant:list:delete', 3, 3, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:59:22', 1, '2025-05-23 02:56:07', b'0');
INSERT INTO `system_menu` VALUES (50, '查看', 'config:menu:get', 3, 0, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:51:30', 1, '2025-05-23 02:07:36', b'0');
INSERT INTO `system_menu` VALUES (51, '新增', 'config:menu:add', 3, 1, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-13 03:32:06', 1, '2025-05-23 03:04:37', b'0');
INSERT INTO `system_menu` VALUES (52, '编辑', 'config:menu:edit', 3, 2, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-13 03:32:52', 1, '2025-05-23 03:04:39', b'0');
INSERT INTO `system_menu` VALUES (53, '删除', 'config:menu:delete', 3, 3, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:04:50', 1, '2025-05-23 03:04:42', b'0');
INSERT INTO `system_menu` VALUES (54, '查看', 'config:dict:get', 3, 0, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 01:51:48', 1, '2025-05-23 02:07:15', b'0');
INSERT INTO `system_menu` VALUES (55, '新增字典类型', 'config:dict:type:add', 3, 1, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:20:14', 1, '2025-05-23 03:04:43', b'0');
INSERT INTO `system_menu` VALUES (56, '新增字典', 'config:dict:add', 3, 2, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:24:22', 1, '2025-05-23 03:04:49', b'0');
INSERT INTO `system_menu` VALUES (57, '修改字典类型', 'config:dict:type:edit', 3, 3, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:12', 1, '2025-05-23 03:04:50', b'0');
INSERT INTO `system_menu` VALUES (58, '修改字典', 'config:dict:edit', 3, 4, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:23', 1, '2025-05-23 03:04:52', b'0');
INSERT INTO `system_menu` VALUES (59, '删除字典', 'config:dict:delete', 3, 5, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:42', 1, '2025-05-23 03:04:53', b'0');
INSERT INTO `system_menu` VALUES (60, '启用', 'system:user:enable', 3, 4, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:50:20', 1, '2025-05-23 02:50:20', b'0');
INSERT INTO `system_menu` VALUES (61, '禁用', 'system:user:disable', 3, 5, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:50:34', 1, '2025-05-23 02:50:34', b'0');
INSERT INTO `system_menu` VALUES (62, '重置密码', 'system:user:reset', 3, 6, 7, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:51:08', 1, '2025-05-23 02:51:08', b'0');
INSERT INTO `system_menu` VALUES (63, '启用', 'system:tenant:package:enable', 3, 4, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:52:15', 1, '2025-05-23 02:52:15', b'0');
INSERT INTO `system_menu` VALUES (64, '禁用', 'system:tenant:package:disable', 3, 5, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:52:28', 1, '2025-05-23 02:52:28', b'0');
INSERT INTO `system_menu` VALUES (65, '菜单权限', 'system:tenant:package:menu', 3, 6, 13, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:52:59', 1, '2025-05-23 02:52:59', b'0');
INSERT INTO `system_menu` VALUES (66, '启用', 'system:tenant:list:enable', 3, 4, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:54:11', 1, '2025-05-23 02:54:11', b'0');
INSERT INTO `system_menu` VALUES (67, '禁用', 'system:tenant:list:disable', 3, 5, 14, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 02:54:22', 1, '2025-05-23 02:54:22', b'0');
INSERT INTO `system_menu` VALUES (68, '启用', 'system:department:enable', 3, 4, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:00:08', 1, '2025-05-23 03:00:08', b'0');
INSERT INTO `system_menu` VALUES (69, '禁用', 'system:department:disable', 3, 5, 10, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:00:25', 1, '2025-05-23 03:00:25', b'0');
INSERT INTO `system_menu` VALUES (70, '启用', 'system:role:enable', 3, 4, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:01:13', 1, '2025-05-23 03:01:13', b'0');
INSERT INTO `system_menu` VALUES (71, '禁用', 'system:role:disable', 3, 5, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:01:25', 1, '2025-05-23 03:01:25', b'0');
INSERT INTO `system_menu` VALUES (72, '菜单权限', 'system:role:menu', 3, 6, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:02:17', 1, '2025-05-23 03:02:17', b'0');
INSERT INTO `system_menu` VALUES (73, '数据权限', 'system:role:data', 3, 7, 12, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:02:51', 1, '2025-05-23 03:02:51', b'0');
INSERT INTO `system_menu` VALUES (74, '启用', 'system:post:enable', 3, 4, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:03:32', 1, '2025-05-23 03:03:32', b'0');
INSERT INTO `system_menu` VALUES (75, '禁用', 'system:post:disable', 3, 5, 21, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:03:43', 1, '2025-05-23 03:03:43', b'0');
INSERT INTO `system_menu` VALUES (76, '启用', 'config:menu:enable', 3, 4, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:05:09', 1, '2025-05-23 03:05:09', b'0');
INSERT INTO `system_menu` VALUES (77, '禁用', 'config:menu:disable', 3, 5, 18, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:05:26', 1, '2025-05-23 03:05:26', b'0');
INSERT INTO `system_menu` VALUES (79, '启用', 'config:dict:enable', 3, 6, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:06:38', 1, '2025-05-23 03:06:38', b'0');
INSERT INTO `system_menu` VALUES (80, '禁用', 'config:dict:disable', 3, 7, 19, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-23 03:06:48', 1, '2025-05-23 03:06:48', b'0');
INSERT INTO `system_menu` VALUES (81, '审计日志', '', 1, 106, 2, '/system/audit', 'audit', '', '', 'global.menu.audit', 0, b'1', b'1', b'1', 1, '2025-06-08 14:30:52', 1, '2025-06-08 15:05:43', b'0');
INSERT INTO `system_menu` VALUES (82, '操作日志', 'audit:operation', 2, 1061, 81, '/system/audit/operation', 'operation', 'pages/system/audit/OperationLogger', 'OperationLogger', 'global.menu.audit.operation', 0, b'1', b'1', b'1', 1, '2025-06-08 14:35:47', 1, '2025-06-08 14:35:47', b'0');
INSERT INTO `system_menu` VALUES (83, '登录日志', 'audit:login', 2, 1062, 81, '/system/audit/login', 'operation', 'pages/system/audit/LoginLogger', 'LoginLogger', 'global.menu.audit.login', 0, b'1', b'1', b'1', 1, '2025-06-08 14:36:35', 1, '2025-06-08 14:36:35', b'0');
INSERT INTO `system_menu` VALUES (84, 'ERP', '', 1, 300, 0, '/erp', 'erp', '', '', 'global.menu.erp', 0, b'1', b'1', b'1', 1, '2025-06-08 14:40:03', 1, '2025-06-08 15:05:45', b'0');
INSERT INTO `system_menu` VALUES (85, '采购管理', '', 1, 301, 84, '/erp/purchase', 'purchase', '', '', 'global.menu.erp.purchase', 0, b'1', b'1', b'1', 1, '2025-06-08 14:46:06', 1, '2025-06-08 15:05:46', b'0');
INSERT INTO `system_menu` VALUES (86, '销售管理', '', 1, 302, 84, '/erp/sale', 'sale', '', '', 'global.menu.erp.sale', 0, b'1', b'1', b'1', 1, '2025-06-08 14:46:58', 1, '2025-06-08 15:05:47', b'0');
INSERT INTO `system_menu` VALUES (87, '库存管理', '', 1, 303, 84, '/erp/inventory', 'inventory', '', '', 'global.menu.erp.inventory', 0, b'1', b'1', b'1', 1, '2025-06-08 14:47:52', 1, '2025-06-08 15:05:49', b'0');
INSERT INTO `system_menu` VALUES (88, '产品管理', '', 1, 304, 84, '/erp/product', 'product', '', '', 'global.menu.erp.product', 0, b'1', b'1', b'1', 1, '2025-06-08 14:48:25', 1, '2025-06-08 15:05:50', b'0');
INSERT INTO `system_menu` VALUES (89, '财务管理', '', 1, 305, 84, '/erp/financial', 'financial', '', '', 'global.menu.erp.financial', 0, b'1', b'1', b'1', 1, '2025-06-08 14:49:12', 1, '2025-06-08 15:05:52', b'0');
INSERT INTO `system_menu` VALUES (90, '采购订单', 'erp:purchase:order', 2, 3011, 85, '/erp/purchase/order', 'purchaseOrder', 'pages/erp/purchase/PurchaseOrder', 'PurchaseOrder', 'global.menu.erp.purchase.order', 0, b'1', b'1', b'1', 1, '2025-06-08 14:53:28', 1, '2025-06-08 15:08:13', b'0');
INSERT INTO `system_menu` VALUES (91, '采购入库', 'erp:purchase:inbound', 2, 3012, 85, '/erp/purchase/inbound', 'purchaseInbound', 'pages/erp/purchase/PurchaseInbound', 'PurchaseInbound', 'global.menu.erp.purchase.inbound', 0, b'1', b'1', b'1', 1, '2025-06-08 14:56:52', 1, '2025-06-08 15:08:15', b'0');
INSERT INTO `system_menu` VALUES (92, '采购退货', 'erp:purchase:return', 2, 3013, 85, '/erp/purchase/return', 'purchaseReturn', 'pages/erp/purchase/PurchaseReturn', 'PurchaseReturn', 'global.menu.erp.purchase.return', 0, b'1', b'1', b'1', 1, '2025-06-08 14:58:03', 1, '2025-06-08 15:08:17', b'0');
INSERT INTO `system_menu` VALUES (93, '供应商信息', 'erp:purchase:supplier', 2, 3014, 85, '/erp/purchase/supplier', 'purchaseSupplier', 'pages/erp/purchase/PurchaseSupplier', 'PurchaseSupplier', 'global.menu.erp.purchase.supplier', 0, b'1', b'1', b'1', 1, '2025-06-08 14:59:08', 1, '2025-06-08 15:08:21', b'0');
INSERT INTO `system_menu` VALUES (94, '销售订单', 'erp:sale:order', 2, 3021, 86, '/erp/sale/order', 'saleOrder', 'pages/erp/sale/SaleOrder', 'SaleOrder', 'global.menu.erp.sale.order', 0, b'1', b'1', b'1', 1, '2025-06-08 15:03:38', 1, '2025-06-08 15:09:39', b'0');
INSERT INTO `system_menu` VALUES (95, '销售出库', 'erp:sale:outbound', 2, 3022, 86, '/erp/sale/outbound', 'saleOutbound', 'pages/erp/sale/SaleOutbound', 'SaleOutbound', 'global.menu.erp.sale.outbound', 0, b'1', b'1', b'1', 1, '2025-06-08 15:09:13', 1, '2025-06-08 15:09:13', b'0');
INSERT INTO `system_menu` VALUES (96, '销售退货', 'erp:sale:return', 2, 3023, 86, '/erp/sale/return', 'saleReturn', 'pages/erp/sale/SaleReturn', 'SaleReturn', 'global.menu.erp.sale.return', 0, b'1', b'1', b'1', 1, '2025-06-08 15:10:39', 1, '2025-06-08 15:10:39', b'0');
INSERT INTO `system_menu` VALUES (97, '客户信息', 'erp:sale:customer', 2, 3024, 86, '/erp/sale/customer', 'saleCustomer', 'pages/erp/sale/SaleCustomer', 'SaleCustomer', 'global.menu.erp.sale.customer', 0, b'1', b'1', b'1', 1, '2025-06-08 15:11:22', 1, '2025-06-08 15:11:22', b'0');
INSERT INTO `system_menu` VALUES (98, '仓库管理', 'erp:inventory:warehouse', 2, 3031, 87, '/erp/inventory/warehouse', 'inventoryWarehouse', 'pages/erp/inventory/InventoryWarehouse', 'InventoryWarehouse', 'global.menu.erp.inventory.warehouse', 0, b'1', b'1', b'1', 1, '2025-06-08 15:14:13', 1, '2025-06-08 15:14:13', b'0');
INSERT INTO `system_menu` VALUES (99, '产品库存', 'erp:inventory:product', 2, 3032, 87, '/erp/inventory/product', 'inventoryProduct', 'pages/erp/inventory/InventoryProduct', 'InventoryProduct', 'global.menu.erp.inventory.product', 0, b'1', b'1', b'1', 1, '2025-06-08 15:15:30', 1, '2025-06-08 15:15:30', b'0');
INSERT INTO `system_menu` VALUES (100, '出入库记录', 'erp:inventory:record', 2, 3033, 87, '/erp/inventory/record', 'inventoryRecord', 'pages/erp/inventory/InventoryRecord', 'InventoryRecord', 'global.menu.erp.inventory.record', 0, b'1', b'1', b'1', 1, '2025-06-08 15:19:08', 1, '2025-06-08 15:19:29', b'0');
INSERT INTO `system_menu` VALUES (101, '其他入库', 'erp:inventory:inbound', 2, 3034, 87, '/erp/inventory/inbound', 'inventoryInbound', 'pages/erp/inventory/InventoryInbound', 'InventoryInbound', 'global.menu.erp.inventory.inbound', 0, b'1', b'1', b'1', 1, '2025-06-08 15:18:27', 1, '2025-06-10 13:47:21', b'0');
INSERT INTO `system_menu` VALUES (103, '其他出库', 'erp:inventory:outbound', 2, 3035, 87, '/erp/inventory/outbound', 'inventoryOutbound', 'pages/erp/inventory/InventoryOutbound', 'InventoryOutbound', 'global.menu.erp.inventory.outbound', 0, b'1', b'1', b'1', 1, '2025-06-08 15:20:20', 1, '2025-06-10 13:54:10', b'0');
INSERT INTO `system_menu` VALUES (104, '库存调拨', 'erp:inventory:transfer', 2, 3036, 87, '/erp/inventory/transfer', 'inventoryTransfer', 'pages/erp/inventory/InventoryTransfer', 'InventoryTransfer', 'global.menu.erp.inventory.transfer', 0, b'1', b'1', b'1', 1, '2025-06-08 15:21:45', 1, '2025-06-08 15:21:45', b'0');
INSERT INTO `system_menu` VALUES (105, '库存盘点', 'erp:inventory:check', 2, 3037, 87, '/erp/inventory/check', 'inventoryCheck', 'pages/erp/inventory/InventoryCheck', 'InventoryCheck', 'global.menu.erp.inventory.check', 0, b'1', b'1', b'1', 1, '2025-06-08 15:22:32', 1, '2025-06-08 15:22:32', b'0');
INSERT INTO `system_menu` VALUES (106, '产品列表', 'erp:product:list', 2, 3041, 88, '/erp/product/list', 'productList', 'pages/erp/product/ProductList', 'ProductList', 'global.menu.erp.product.list', 0, b'1', b'1', b'1', 1, '2025-06-08 15:25:10', 1, '2025-06-08 15:25:10', b'0');
INSERT INTO `system_menu` VALUES (107, '产品分类', 'erp:product:category', 2, 3042, 88, '/erp/product/category', 'productCategory', 'pages/erp/product/ProductCategory', 'ProductCategory', 'global.menu.erp.product.category', 0, b'1', b'1', b'1', 1, '2025-06-08 15:26:10', 1, '2025-06-08 15:26:10', b'0');
INSERT INTO `system_menu` VALUES (108, '产品单位', 'erp:product:unit', 2, 3043, 88, '/erp/product/unit', 'productUnit', 'pages/erp/product/ProductUnit', 'ProductUnit', 'global.menu.erp.product.unit', 0, b'1', b'1', b'1', 1, '2025-06-08 15:26:42', 1, '2025-06-08 15:26:42', b'0');
INSERT INTO `system_menu` VALUES (109, '付款', 'erp:financial:payment', 2, 3051, 89, '/erp/financial/payment', 'financialPayment', 'pages/erp/financial/FinancialPayment', 'FinancialPayment', 'global.menu.erp.financial.payment', 0, b'1', b'1', b'1', 1, '2025-06-08 15:28:21', 1, '2025-06-08 15:28:21', b'0');
INSERT INTO `system_menu` VALUES (110, '收款', 'erp:financial:receipt', 2, 3052, 89, '/erp/financial/receipt', 'financialReceipt', 'pages/erp/financial/FinancialReceipt', 'FinancialReceipt', 'global.menu.erp.financial.receipt', 0, b'1', b'1', b'1', 1, '2025-06-08 15:29:02', 1, '2025-06-08 15:29:02', b'0');
INSERT INTO `system_menu` VALUES (111, '结算账户', 'erp:financial:account', 2, 3053, 89, '/erp/financial/account', 'financialAccount', 'pages/erp/financial/FinancialAccount', 'FinancialAccount', 'global.menu.erp.financial.account', 0, b'1', b'1', b'1', 1, '2025-06-08 15:30:06', 1, '2025-06-08 15:30:06', b'0');
INSERT INTO `system_menu` VALUES (112, '查看', 'erp:inventory:warehouse:get', 3, 0, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:33:30', 1, '2025-06-09 12:34:27', b'0');
INSERT INTO `system_menu` VALUES (113, '新增', 'erp:inventory:warehouse:add', 3, 1, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:34:18', 1, '2025-06-09 12:34:18', b'0');
INSERT INTO `system_menu` VALUES (114, '修改', 'erp:inventory:warehouse:edit', 3, 2, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:36:21', 1, '2025-06-09 12:36:21', b'0');
INSERT INTO `system_menu` VALUES (115, '删除', 'erp:inventory:warehouse:delete', 3, 3, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:36:38', 1, '2025-06-09 12:36:38', b'0');
INSERT INTO `system_menu` VALUES (116, '启用', 'erp:inventory:warehouse:enable', 3, 4, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:37:29', 1, '2025-06-09 12:37:29', b'0');
INSERT INTO `system_menu` VALUES (117, '禁用', 'erp:inventory:warehouse:disable', 3, 5, 98, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-09 12:37:45', 1, '2025-06-09 12:37:45', b'0');
INSERT INTO `system_menu` VALUES (118, '查看', 'erp:product:category:get', 3, 0, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (119, '新增', 'erp:product:category:add', 3, 1, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (120, '修改', 'erp:product:category:edit', 3, 2, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (121, '删除', 'erp:product:category:delete', 3, 3, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (122, '启用', 'erp:product:category:enable', 3, 4, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-10 02:15:01', b'0');
INSERT INTO `system_menu` VALUES (123, '禁用', 'erp:product:category:disable', 3, 5, 107, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-10 02:15:29', b'0');
INSERT INTO `system_menu` VALUES (124, '查看', 'erp:product:unit:get', 3, 0, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (125, '新增', 'erp:product:unit:add', 3, 1, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (126, '修改', 'erp:product:unit:edit', 3, 2, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (127, '删除', 'erp:product:unit:delete', 3, 3, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (128, '启用', 'erp:product:unit:enable', 3, 4, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-10 02:15:01', b'0');
INSERT INTO `system_menu` VALUES (129, '禁用', 'erp:product:unit:disable', 3, 5, 108, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-10 02:15:29', b'0');
INSERT INTO `system_menu` VALUES (130, '查看', 'erp:product:list:get', 3, 0, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (131, '新增', 'erp:product:list:add', 3, 1, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (132, '修改', 'erp:product:list:edit', 3, 2, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (133, '删除', 'erp:product:list:delete', 3, 3, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (134, '启用', 'erp:product:list:enable', 3, 4, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-10 02:15:01', b'0');
INSERT INTO `system_menu` VALUES (135, '禁用', 'erp:product:list:disable', 3, 5, 106, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-10 02:15:29', b'0');
INSERT INTO `system_menu` VALUES (136, '查看', 'erp:financial:account:get', 3, 0, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (137, '新增', 'erp:financial:account:add', 3, 1, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (138, '修改', 'erp:financial:account:edit', 3, 2, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (139, '删除', 'erp:financial:account:delete', 3, 3, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (140, '启用', 'erp:financial:account:enable', 3, 4, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-10 02:15:01', b'0');
INSERT INTO `system_menu` VALUES (141, '禁用', 'erp:financial:account:disable', 3, 5, 111, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-10 02:15:29', b'0');
INSERT INTO `system_menu` VALUES (142, '查看', 'erp:purchase:supplier:get', 3, 0, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 13:55:40', 1, '2025-06-10 13:55:40', b'0');
INSERT INTO `system_menu` VALUES (143, '新增', 'erp:purchase:supplier:add', 3, 1, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 14:01:27', 1, '2025-06-10 14:01:27', b'0');
INSERT INTO `system_menu` VALUES (144, '修改', 'erp:purchase:supplier:edit', 3, 2, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 14:06:50', 1, '2025-06-10 14:06:50', b'0');
INSERT INTO `system_menu` VALUES (145, '删除', 'erp:purchase:supplier:delete', 3, 3, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 14:08:09', 1, '2025-06-10 14:08:09', b'0');
INSERT INTO `system_menu` VALUES (146, '启用', 'erp:purchase:supplier:enable', 3, 4, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 14:14:35', 1, '2025-06-10 14:14:35', b'0');
INSERT INTO `system_menu` VALUES (147, '禁用', 'erp:purchase:supplier:disable', 3, 5, 93, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 14:14:51', 1, '2025-06-10 14:14:51', b'0');
INSERT INTO `system_menu` VALUES (148, '查看', 'erp:sale:customer:get', 3, 0, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (149, '新增', 'erp:sale:customer:add', 3, 1, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (150, '修改', 'erp:sale:customer:edit', 3, 2, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (151, '删除', 'erp:sale:customer:delete', 3, 3, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (152, '启用', 'erp:sale:customer:enable', 3, 4, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-10 02:15:01', b'0');
INSERT INTO `system_menu` VALUES (153, '禁用', 'erp:sale:customer:disable', 3, 5, 97, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-10 02:15:29', b'0');
INSERT INTO `system_menu` VALUES (154, '查看', 'erp:purchase:order:get', 3, 0, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:12:20', 1, '2025-06-10 02:12:20', b'0');
INSERT INTO `system_menu` VALUES (155, '新增', 'erp:purchase:order:add', 3, 1, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:19', 1, '2025-06-10 02:13:19', b'0');
INSERT INTO `system_menu` VALUES (156, '修改', 'erp:purchase:order:edit', 3, 2, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:36', 1, '2025-06-10 02:13:36', b'0');
INSERT INTO `system_menu` VALUES (157, '删除', 'erp:purchase:order:delete', 3, 3, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:13:54', 1, '2025-06-10 02:13:54', b'0');
INSERT INTO `system_menu` VALUES (158, '已收货', 'erp:purchase:order:received', 3, 4, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:01', 1, '2025-06-16 08:39:45', b'0');
INSERT INTO `system_menu` VALUES (159, '取消订单', 'erp:purchase:order:cancel', 3, 5, 90, '', '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-06-10 02:15:29', 1, '2025-06-16 08:39:50', b'0');

-- ----------------------------
-- Table structure for system_notice
-- ----------------------------
DROP TABLE IF EXISTS `system_notice`;
CREATE TABLE `system_notice`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告内容',
  `type` tinyint NOT NULL COMMENT '公告类型（1通知 2公告）',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '公告状态（0正常 1关闭）',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '通知公告表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_notice
-- ----------------------------

-- ----------------------------
-- Table structure for system_post
-- ----------------------------
DROP TABLE IF EXISTS `system_post`;
CREATE TABLE `system_post`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位编码',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位名称',
  `sort` int NOT NULL COMMENT '显示顺序',
  `status` tinyint NOT NULL COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '职位信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_post
-- ----------------------------
INSERT INTO `system_post` VALUES (1, '', '董事长', 0, 0, '董事长', 1, '2025-05-18 13:37:14', 1, '2025-05-18 13:37:14', b'0', 1);
INSERT INTO `system_post` VALUES (2, 'h', '总裁', 1, 0, '总裁', 1, '2025-05-18 13:37:27', 1, '2025-05-18 13:41:44', b'0', 1);

-- ----------------------------
-- Table structure for system_role
-- ----------------------------
DROP TABLE IF EXISTS `system_role`;
CREATE TABLE `system_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` tinyint NOT NULL COMMENT '角色类型',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色权限字符串',
  `status` tinyint NOT NULL COMMENT '角色状态（0正常 1停用）',
  `sort` int NOT NULL COMMENT '显示顺序',
  `data_scope_rule_id` bigint NOT NULL DEFAULT 4 COMMENT '数据权限规则id',
  `data_scope_department_ids` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '数据范围(指定部门数组)',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_role
-- ----------------------------
INSERT INTO `system_role` VALUES (1, 0, '超级管理员', 'super_admin', 0, 1, 1, '', '超级管理员', 1, '2025-03-25 03:28:46', 1, '2025-05-14 14:05:11', b'0', 1);
INSERT INTO `system_role` VALUES (2, 0, '租户管理员', 'tenant_admin', 0, 2, 2, '', '租户管理员', 1, '2025-05-14 14:57:37', 1, '2025-05-15 08:32:30', b'0', 1);
INSERT INTO `system_role` VALUES (3, 1, '开发', 'dev', 0, 3, 5, '1,4,5', '开发1', 1, '2025-05-14 15:29:04', 1, '2025-05-22 07:18:28', b'0', 1);
INSERT INTO `system_role` VALUES (4, 1, '测试', 'test', 0, 4, 4, '', '测试', 1, '2025-05-15 09:29:04', 1, '2025-05-15 09:29:28', b'0', 1);

-- ----------------------------
-- Table structure for system_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `system_role_menu`;
CREATE TABLE `system_role_menu`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 259 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_role_menu
-- ----------------------------
INSERT INTO `system_role_menu` VALUES (81, 1, 7, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (82, 1, 14, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (83, 1, 3, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (84, 1, 50, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (85, 1, 39, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (86, 1, 40, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (87, 1, 35, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (88, 1, 77, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (89, 1, 19, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (90, 1, 47, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (91, 1, 56, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (92, 1, 34, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (93, 1, 79, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:49:15', b'0', 1);
INSERT INTO `system_role_menu` VALUES (94, 1, 38, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (95, 1, 36, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (96, 1, 44, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (97, 1, 48, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (98, 1, 55, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (99, 1, 37, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (100, 1, 57, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (101, 1, 60, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (102, 1, 74, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (103, 1, 59, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (104, 1, 42, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (105, 1, 43, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (106, 1, 33, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (107, 1, 18, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (108, 1, 67, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (109, 1, 30, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (110, 1, 80, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:49:15', b'0', 1);
INSERT INTO `system_role_menu` VALUES (111, 1, 28, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (112, 1, 72, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (113, 1, 51, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (114, 1, 12, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (115, 1, 27, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (116, 1, 1, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (117, 1, 32, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (118, 1, 61, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (119, 1, 52, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (120, 1, 53, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (121, 1, 68, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (122, 1, 11, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (123, 1, 69, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (124, 1, 64, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (125, 1, 73, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (126, 1, 31, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (127, 1, 58, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (128, 1, 21, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (129, 1, 54, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (130, 1, 29, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (131, 1, 45, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (132, 1, 46, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (133, 1, 70, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (134, 1, 75, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (135, 1, 62, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (136, 1, 10, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (137, 1, 66, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (138, 1, 71, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (139, 1, 63, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (140, 1, 2, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (141, 1, 41, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (142, 1, 65, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (143, 1, 26, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (144, 1, 76, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (145, 1, 25, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (146, 1, 13, 1, '2025-05-23 06:33:58', 1, '2025-05-23 06:33:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (147, 2, 18, 1, '2025-05-23 06:44:33', 1, '2025-05-23 07:34:48', b'1', 1);
INSERT INTO `system_role_menu` VALUES (148, 2, 51, 1, '2025-05-23 06:44:33', 1, '2025-05-23 07:34:48', b'1', 1);
INSERT INTO `system_role_menu` VALUES (149, 2, 3, 1, '2025-05-23 06:44:33', 1, '2025-05-23 07:34:48', b'1', 1);
INSERT INTO `system_role_menu` VALUES (150, 2, 50, 1, '2025-05-23 06:44:33', 1, '2025-05-23 07:34:48', b'1', 1);
INSERT INTO `system_role_menu` VALUES (151, 2, 69, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (152, 2, 38, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (153, 2, 27, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (154, 2, 29, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (155, 2, 21, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (156, 2, 70, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (157, 2, 40, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (158, 2, 31, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (159, 2, 75, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (160, 2, 74, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (161, 2, 37, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (162, 2, 12, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (163, 2, 32, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (164, 2, 68, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (165, 2, 60, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (166, 2, 61, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (167, 2, 34, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (168, 2, 73, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (169, 2, 10, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (170, 2, 36, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (171, 2, 33, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (172, 2, 72, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (173, 2, 26, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (174, 2, 1, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (175, 2, 62, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (176, 2, 7, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (177, 2, 30, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (178, 2, 25, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (179, 2, 28, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (180, 2, 35, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (181, 2, 71, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (182, 2, 2, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (183, 2, 39, 1, '2025-05-23 07:34:48', 1, '2025-05-23 07:34:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (184, 1, 91, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (185, 1, 85, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (186, 1, 87, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (187, 1, 101, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (188, 1, 84, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (189, 1, 94, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (190, 1, 100, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (191, 1, 105, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (192, 1, 89, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (193, 1, 103, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (194, 1, 88, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (195, 1, 111, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (196, 1, 86, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (197, 1, 97, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (198, 1, 98, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (199, 1, 99, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (200, 1, 92, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (201, 1, 108, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (202, 1, 95, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (203, 1, 109, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (204, 1, 107, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (205, 1, 110, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (206, 1, 106, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (207, 1, 93, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (208, 1, 104, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (209, 1, 90, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (210, 1, 96, 1, '2025-06-08 15:30:29', 1, '2025-06-08 15:30:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (211, 1, 116, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (212, 1, 115, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (213, 1, 114, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (214, 1, 113, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (215, 1, 112, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (216, 1, 117, 1, '2025-06-09 12:43:42', 1, '2025-06-09 12:43:42', b'0', 1);
INSERT INTO `system_role_menu` VALUES (217, 1, 127, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (218, 1, 128, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (219, 1, 132, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (220, 1, 125, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (221, 1, 129, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (222, 1, 130, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (223, 1, 123, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (224, 1, 126, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (225, 1, 121, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (226, 1, 120, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (227, 1, 134, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (228, 1, 135, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (229, 1, 119, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (230, 1, 118, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (231, 1, 122, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (232, 1, 133, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (233, 1, 124, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (234, 1, 131, 1, '2025-06-10 02:29:29', 1, '2025-06-10 02:29:29', b'0', 1);
INSERT INTO `system_role_menu` VALUES (235, 1, 137, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (236, 1, 146, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (237, 1, 148, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (238, 1, 145, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (239, 1, 151, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (240, 1, 136, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (241, 1, 141, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (242, 1, 142, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (243, 1, 152, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (244, 1, 138, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (245, 1, 140, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (246, 1, 143, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (247, 1, 153, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (248, 1, 144, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (249, 1, 149, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (250, 1, 147, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (251, 1, 150, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (252, 1, 139, 1, '2025-06-10 14:23:11', 1, '2025-06-10 14:23:11', b'0', 1);
INSERT INTO `system_role_menu` VALUES (253, 1, 158, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);
INSERT INTO `system_role_menu` VALUES (254, 1, 159, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);
INSERT INTO `system_role_menu` VALUES (255, 1, 157, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);
INSERT INTO `system_role_menu` VALUES (256, 1, 156, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);
INSERT INTO `system_role_menu` VALUES (257, 1, 155, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);
INSERT INTO `system_role_menu` VALUES (258, 1, 154, 1, '2025-06-12 02:51:33', 1, '2025-06-12 02:51:33', b'0', 1);

-- ----------------------------
-- Table structure for system_role_menu_data_scope
-- ----------------------------
DROP TABLE IF EXISTS `system_role_menu_data_scope`;
CREATE TABLE `system_role_menu_data_scope`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_menu_id` bigint NOT NULL COMMENT '角色菜单ID',
  `data_scope_rule_id` bigint NOT NULL COMMENT '权限规则ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色菜单和数据权限关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_role_menu_data_scope
-- ----------------------------

-- ----------------------------
-- Table structure for system_tenant
-- ----------------------------
DROP TABLE IF EXISTS `system_tenant`;
CREATE TABLE `system_tenant`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '租户名',
  `contact_user_id` bigint NULL DEFAULT NULL COMMENT '联系人的用户编号',
  `contact_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contact_mobile` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系手机',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '租户状态（0正常 1停用）',
  `website` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '绑定域名',
  `package_id` bigint NOT NULL COMMENT '租户套餐编号',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `account_count` int NOT NULL COMMENT '账号数量',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '租户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_tenant
-- ----------------------------
INSERT INTO `system_tenant` VALUES (1, '管理租户', 1, '管理员', '18888888888', 0, '', 1, '2039-12-31 18:15:40', 1, 1, '2025-03-08 10:16:18', 1, '2025-05-17 01:11:29', b'0');
INSERT INTO `system_tenant` VALUES (2, '测试租户', 11, '测试管理员', '15555555555', 0, 'www.test.com', 1, '2025-06-23 16:15:34', 5, 1, '2025-05-23 08:16:00', 1, '2025-05-23 08:16:00', b'0');

-- ----------------------------
-- Table structure for system_tenant_package
-- ----------------------------
DROP TABLE IF EXISTS `system_tenant_package`;
CREATE TABLE `system_tenant_package`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '套餐名',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '租户状态（0正常 1停用）',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '备注',
  `menu_ids` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联的菜单编号',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '租户套餐表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_tenant_package
-- ----------------------------
INSERT INTO `system_tenant_package` VALUES (1, '超级套餐', 0, '', '[1,2,7,25,26,27,28,60,61,62,10,29,30,31,32,68,69,11,13,41,42,43,44,63,64,65,14,45,46,47,48,66,67,12,33,34,35,36,70,71,72,73,21,37,38,39,40,74,75,3,18,50,51,52,53,76,77,19,54,55,56,57,58,59,79,80]', 1, '2025-03-08 10:17:29', 1, '2025-05-23 08:06:37', b'0');
INSERT INTO `system_tenant_package` VALUES (2, '测试套餐', 0, '测试套餐', '[1,2,7,10,11,12,13,14]', 1, '2025-05-17 05:34:45', 1, '2025-05-17 05:35:03', b'0');

-- ----------------------------
-- Table structure for system_user
-- ----------------------------
DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户账号',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '用户邮箱',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号码',
  `sex` tinyint NULL DEFAULT 0 COMMENT '用户性别',
  `avatar` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '头像地址',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '帐号状态（0正常 1停用）',
  `login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `department_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '部门编码',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user
-- ----------------------------
INSERT INTO `system_user` VALUES (1, 'admin', '$2b$06$Ohq86rDIvNuy/4ZvsTF4dOw.7I7QJj620LC25PwgYDmrKqKmKsJz6', '超级管理员', '超级管理员', '123@qq.com', '18888888888', 0, '', 0, '127.0.0.1', '2025-06-15 09:58:38', '0000', 1, 1, '2025-03-08 10:14:52', 1, '2025-06-15 09:58:40', b'0', 1);
INSERT INTO `system_user` VALUES (11, 'test', '$2b$06$S2yMOy4Mp5gImLOEl8X3K.T8XAWrfXVwGXK/vOBL.30PGNnnGIDzy', '测试管理员', NULL, '', '15555555555', 0, '', 0, '127.0.0.1', '2025-05-23 08:16:27', '0000-0000', 7, 1, '2025-05-23 08:16:00', 1, '2025-05-23 08:16:25', b'0', 2);

-- ----------------------------
-- Table structure for system_user_post
-- ----------------------------
DROP TABLE IF EXISTS `system_user_post`;
CREATE TABLE `system_user_post`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户ID',
  `post_id` bigint NOT NULL DEFAULT 0 COMMENT '职位ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户职位表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user_post
-- ----------------------------
INSERT INTO `system_user_post` VALUES (1, 9, 2, 1, '2025-05-21 02:18:40', 1, '2025-05-21 02:18:40', b'0', 1);
INSERT INTO `system_user_post` VALUES (2, 9, 1, 1, '2025-05-21 02:18:40', 1, '2025-05-21 02:18:40', b'0', 1);

-- ----------------------------
-- Table structure for system_user_role
-- ----------------------------
DROP TABLE IF EXISTS `system_user_role`;
CREATE TABLE `system_user_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `creator` bigint NULL DEFAULT NULL COMMENT '创建者id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` bigint NULL DEFAULT NULL COMMENT '更新者id',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户和角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user_role
-- ----------------------------
INSERT INTO `system_user_role` VALUES (1, 1, 1, 1, '2025-03-25 03:32:08', 1, '2025-03-25 03:32:08', b'0', 0);
INSERT INTO `system_user_role` VALUES (3, 11, 2, 1, '2025-05-23 08:16:00', 1, '2025-05-23 08:16:00', b'0', 1);

SET FOREIGN_KEY_CHECKS = 1;
