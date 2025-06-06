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

 Date: 04/06/2025 09:44:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '字典数据表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '字典类型表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_dict_type
-- ----------------------------
INSERT INTO `system_dict_type` VALUES (1, '性别', 'sex', 0, '性别', 1, '2025-04-28 07:02:02', 1, '2025-04-28 07:02:02', b'0');
INSERT INTO `system_dict_type` VALUES (2, '菜单类型', 'menu_type', 0, '菜单类型', 1, '2025-04-28 07:23:37', 1, '2025-04-28 07:23:37', b'0');
INSERT INTO `system_dict_type` VALUES (3, '状态', 'status', 0, '状态', 1, '2025-04-29 01:37:35', 1, '2025-04-29 01:37:35', b'0');
INSERT INTO `system_dict_type` VALUES (4, '是否删除', 'deleted', 0, '是否删除', 1, '2025-04-30 07:04:05', 1, '2025-04-30 07:04:05', b'0');
INSERT INTO `system_dict_type` VALUES (5, '角色类型', 'role_type', 0, '角色类型', 1, '2025-05-14 09:29:30', 1, '2025-05-14 09:29:30', b'0');

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
) ENGINE = InnoDB AUTO_INCREMENT = 81 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 184 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = DYNAMIC;

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
INSERT INTO `system_user` VALUES (1, 'admin', '$2b$06$Ohq86rDIvNuy/4ZvsTF4dOw.7I7QJj620LC25PwgYDmrKqKmKsJz6', '超级管理员', '超级管理员', '123@qq.com', '18888888888', 0, '', 0, '127.0.0.1', '2025-06-04 01:00:54', '0000', 1, 1, '2025-03-08 10:14:52', 1, '2025-06-04 01:00:54', b'0', 1);
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
