/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.1.18_ruoyi
 Source Server Type    : MySQL
 Source Server Version : 80200 (8.2.0)
 Source Host           : 192.168.1.18:30010
 Source Schema         : synerunify

 Target Server Type    : MySQL
 Target Server Version : 80200 (8.2.0)
 File Encoding         : 65001

 Date: 18/05/2025 22:00:44
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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '部门表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_department
-- ----------------------------
INSERT INTO `system_department` VALUES (1, '0000', '总部', 0, 1, 1, '18888888888', '123@qq.com', 0, 1, '2025-03-08 10:04:46', 1, '2025-05-17 12:35:29', b'0', 1);
INSERT INTO `system_department` VALUES (2, '0000-0000', '测试租户', 1, 0, NULL, NULL, NULL, 0, 1, '2025-05-17 08:13:42', 1, '2025-05-17 08:13:42', b'0', 2);
INSERT INTO `system_department` VALUES (3, '0000-0001', '测试租户1', 1, 0, NULL, NULL, NULL, 0, 1, '2025-05-17 08:35:05', 1, '2025-05-17 08:35:05', b'0', 3);
INSERT INTO `system_department` VALUES (4, '0000-0002', '研发部', 1, 2, NULL, '13434353423', 'ffsdp@outlook.com', 0, 1, '2025-05-17 14:47:05', 1, '2025-05-18 02:27:35', b'0', 1);
INSERT INTO `system_department` VALUES (5, '0000-0003', '测试部', 1, 3, NULL, '13434353423', '123@q.com', 0, 1, '2025-05-17 14:51:54', 1, '2025-05-17 14:51:54', b'0', 1);

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
INSERT INTO `system_dict_data` VALUES (2, 0, '男', '0', 'sex', 0, '', '', '男', 1, '2025-04-28 09:26:26', 1, '2025-04-28 09:26:26', b'0');
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
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_menu
-- ----------------------------
INSERT INTO `system_menu` VALUES (1, 'Dashboard', '', 2, 50, 0, '/dashboard', '#', 'pages/Dashboard', 'Dashboard', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-05-12 06:46:02', b'0');
INSERT INTO `system_menu` VALUES (2, '系统管理', '', 1, 100, 0, '/system', '#', NULL, NULL, 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-05-14 02:59:07', b'0');
INSERT INTO `system_menu` VALUES (3, '配置管理', '', 1, 200, 0, '/config', '#', NULL, NULL, 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-05-12 06:46:11', b'0');
INSERT INTO `system_menu` VALUES (4, '字典管理', 'dict', 2, 201, 3, '/config/dict', '#', 'pages/config/DictManage', 'DictManage', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-05-16 02:49:15', b'0');
INSERT INTO `system_menu` VALUES (5, '菜单管理', 'menu', 2, 202, 3, '/config/menu', '#', 'pages/config/MenuManage', 'MenuManage', 0, b'1', b'1', b'1', 1, '2025-03-25 03:07:08', 1, '2025-05-16 02:49:22', b'0');
INSERT INTO `system_menu` VALUES (6, '支付管理', '', 1, 400, 0, '/pay', 'pay', '', '', 0, b'1', b'1', b'1', 1, '2025-05-12 00:53:57', 1, '2025-05-12 08:41:17', b'1');
INSERT INTO `system_menu` VALUES (7, '用户管理', 'user', 2, 104, 2, '/system/user', 'user', 'pages/system/UserManage', 'UserManage', 0, b'1', b'1', b'1', 1, '2025-05-12 00:54:51', 1, '2025-05-16 02:49:56', b'0');
INSERT INTO `system_menu` VALUES (8, '新增', 'config:menu:add', 3, 0, 5, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-13 03:32:06', 1, '2025-05-16 01:03:37', b'0');
INSERT INTO `system_menu` VALUES (9, '编辑', 'config:menu:edit', 3, 1, 5, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-13 03:32:52', 1, '2025-05-16 01:03:41', b'0');
INSERT INTO `system_menu` VALUES (10, '部门管理', 'department', 2, 103, 2, '/system/department', 'department', 'pages/system/DepartmentManage', 'DepartmentManage', 0, b'1', b'1', b'1', 1, '2025-05-14 06:31:37', 1, '2025-05-16 02:49:42', b'0');
INSERT INTO `system_menu` VALUES (11, '租户管理', '', 1, 101, 2, '/system/tenant', 'tenant', '', '', 0, b'1', b'0', b'1', 1, '2025-05-14 06:41:40', 1, '2025-05-15 14:06:35', b'0');
INSERT INTO `system_menu` VALUES (12, '角色管理', 'role', 2, 102, 2, '/system/role', 'role', 'pages/system/RoleManage', 'RoleManage', 0, b'1', b'1', b'1', 1, '2025-05-14 06:42:15', 1, '2025-05-16 02:49:50', b'0');
INSERT INTO `system_menu` VALUES (13, '租户套餐', 'tenant:package', 2, 102, 11, '/system/tenant/package', 'tenant_package', 'pages/system/tenant/TenantPackageManage', 'TenantPackageManage', 0, b'1', b'1', b'1', 1, '2025-05-15 14:08:27', 1, '2025-05-16 02:50:18', b'0');
INSERT INTO `system_menu` VALUES (14, '租户列表', 'tenant:list', 2, 103, 11, '/system/tenant/list', 'tenant_list', 'pages/system/tenant/TenantListManage', 'TenantListManage', 0, b'1', b'1', b'1', 1, '2025-05-15 14:09:52', 1, '2025-05-16 02:50:24', b'0');
INSERT INTO `system_menu` VALUES (15, '删除', 'config:menu:delete', 3, 2, 5, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:04:50', 1, '2025-05-16 01:04:50', b'0');
INSERT INTO `system_menu` VALUES (16, '新增字典类型', 'config:dict:type:add', 3, 0, 4, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:20:14', 1, '2025-05-16 01:25:34', b'0');
INSERT INTO `system_menu` VALUES (17, '新增字典', 'config:dict:add', 3, 1, 4, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:24:22', 1, '2025-05-16 01:24:22', b'0');
INSERT INTO `system_menu` VALUES (18, '修改字典类型', 'config:dict:type:edit', 3, 2, 4, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:12', 1, '2025-05-16 01:26:12', b'0');
INSERT INTO `system_menu` VALUES (19, '修改字典', 'config:dict:edit', 3, 2, 4, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:23', 1, '2025-05-16 01:26:23', b'0');
INSERT INTO `system_menu` VALUES (20, '删除字典', 'config:dict:delete', 3, 3, 4, '', '', '', '', 0, b'1', b'0', b'1', 1, '2025-05-16 01:26:42', 1, '2025-05-16 01:26:42', b'0');
INSERT INTO `system_menu` VALUES (21, '岗位管理', 'post', 2, 107, 2, '/system/post', 'post', 'pages/system/PostManage', 'PostManage', 0, b'1', b'1', b'1', 1, '2025-05-18 07:22:36', 1, '2025-05-18 07:22:36', b'0');

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
INSERT INTO `system_role` VALUES (3, 1, '开发', 'dev', 0, 3, 4, '', '开发1', 1, '2025-05-14 15:29:04', 1, '2025-05-18 02:27:00', b'0', 1);
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
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_role_menu
-- ----------------------------
INSERT INTO `system_role_menu` VALUES (1, 1, 1, 1, '2025-03-25 03:29:38', 1, '2025-05-15 07:19:18', b'0', 1);
INSERT INTO `system_role_menu` VALUES (2, 1, 2, 1, '2025-03-25 03:29:55', 1, '2025-05-15 07:19:19', b'0', 1);
INSERT INTO `system_role_menu` VALUES (3, 1, 3, 1, '2025-03-25 03:30:03', 1, '2025-05-15 07:19:20', b'0', 1);
INSERT INTO `system_role_menu` VALUES (4, 1, 4, 1, '2025-03-25 03:30:10', 1, '2025-05-15 07:19:22', b'0', 1);
INSERT INTO `system_role_menu` VALUES (5, 1, 5, 1, '2025-03-26 02:15:57', 1, '2025-05-15 07:19:23', b'0', 1);
INSERT INTO `system_role_menu` VALUES (6, 1, 12, 1, '2025-03-26 02:15:57', 1, '2025-05-15 07:19:26', b'0', 1);
INSERT INTO `system_role_menu` VALUES (7, 3, 1, 1, '2025-05-15 07:17:48', 1, '2025-05-15 07:17:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (8, 3, 7, 1, '2025-05-15 07:17:48', 1, '2025-05-15 07:17:48', b'0', 1);
INSERT INTO `system_role_menu` VALUES (9, 3, 12, 1, '2025-05-15 07:19:58', 1, '2025-05-15 07:19:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (10, 3, 10, 1, '2025-05-15 07:19:58', 1, '2025-05-15 07:19:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (11, 3, 11, 1, '2025-05-15 07:19:58', 1, '2025-05-15 07:19:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (12, 3, 2, 1, '2025-05-15 07:19:58', 1, '2025-05-15 07:19:58', b'0', 1);
INSERT INTO `system_role_menu` VALUES (13, 1, 11, 1, '2025-05-15 07:20:52', 1, '2025-05-15 07:20:52', b'0', 1);
INSERT INTO `system_role_menu` VALUES (14, 1, 8, 1, '2025-05-15 07:20:52', 1, '2025-05-15 07:20:52', b'0', 1);
INSERT INTO `system_role_menu` VALUES (15, 1, 7, 1, '2025-05-15 07:20:52', 1, '2025-05-15 07:20:52', b'0', 1);
INSERT INTO `system_role_menu` VALUES (16, 1, 10, 1, '2025-05-15 07:20:52', 1, '2025-05-15 07:20:52', b'0', 1);
INSERT INTO `system_role_menu` VALUES (17, 1, 9, 1, '2025-05-15 07:20:52', 1, '2025-05-15 07:20:52', b'0', 1);
INSERT INTO `system_role_menu` VALUES (18, 1, 13, 1, '2025-05-15 14:23:23', 1, '2025-05-15 14:23:23', b'0', 1);
INSERT INTO `system_role_menu` VALUES (19, 1, 14, 1, '2025-05-15 14:23:23', 1, '2025-05-15 14:23:23', b'0', 1);
INSERT INTO `system_role_menu` VALUES (20, 1, 20, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (21, 1, 16, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (22, 1, 17, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (23, 1, 19, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (24, 1, 15, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (25, 1, 18, 1, '2025-05-16 01:28:04', 1, '2025-05-16 01:28:04', b'0', 1);
INSERT INTO `system_role_menu` VALUES (26, 1, 21, 1, '2025-05-18 07:35:15', 1, '2025-05-18 07:35:15', b'0', 1);

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
INSERT INTO `system_tenant` VALUES (2, '测试租户', 3, '测试', '13333', 0, 'www.test.com', 2, '2025-06-18 14:39:29', 5, 1, '2025-05-17 08:13:42', 1, '2025-05-17 09:33:22', b'0');
INSERT INTO `system_tenant` VALUES (3, '测试租户1', 4, '测试1', '15555555', 0, 'www.test.com', 1, '2025-06-17 16:25:46', 5, 1, '2025-05-17 08:35:05', 1, '2025-05-17 08:35:05', b'0');

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
INSERT INTO `system_tenant_package` VALUES (1, '超级套餐', 0, '', '[1]', 1, '2025-03-08 10:17:29', 1, '2025-03-08 10:17:29', b'0');
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
  `post_ids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '职位编号数组',
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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user
-- ----------------------------
INSERT INTO `system_user` VALUES (1, 'admin', '$2b$06$Ohq86rDIvNuy/4ZvsTF4dOw.7I7QJj620LC25PwgYDmrKqKmKsJz6', '超级管理员', '超级管理员', NULL, '123@qq.com', '18888888888', 0, '', 0, '127.0.0.1', '2025-05-18 07:09:23', '0000', 1, 1, '2025-03-08 10:14:52', 1, '2025-05-18 07:09:22', b'0', 1);
INSERT INTO `system_user` VALUES (3, 'test', '$2b$06$LiMzvNQ7OgwEndSAwZR9LeLnLMt.bAUJ4yr/dsvB8X2Ue2Ecgy2ja', '测试', NULL, NULL, '', '13333', 0, '', 0, '', NULL, '0000-0000', 2, 1, '2025-05-17 08:13:42', 1, '2025-05-17 08:35:56', b'0', 2);
INSERT INTO `system_user` VALUES (4, 'test1', '$2b$06$LiMzvNQ7OgwEndSAwZR9LeLnLMt.bAUJ4yr/dsvB8X2Ue2Ecgy2ja', '测试1', NULL, NULL, '', '15555555', 0, '', 0, '', NULL, '0000-0001', 3, 1, '2025-05-17 08:35:05', 1, '2025-05-17 08:35:05', b'0', 3);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户职位表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user_post
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户和角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of system_user_role
-- ----------------------------
INSERT INTO `system_user_role` VALUES (1, 1, 1, 1, '2025-03-25 03:32:08', 1, '2025-03-25 03:32:08', b'0', 0);

SET FOREIGN_KEY_CHECKS = 1;
