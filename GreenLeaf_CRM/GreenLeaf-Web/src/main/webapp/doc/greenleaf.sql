/*
Navicat MySQL Data Transfer

Source Server         : wamp
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : greenleaf

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2015-04-03 18:15:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `MENU_NAME` varchar(30) NOT NULL COMMENT '菜单名称',
  `PARENT_ID` int(11) NOT NULL COMMENT '父菜单ID',
  `SORT` int(11) DEFAULT NULL COMMENT '排序',
  `ICON` varchar(30) DEFAULT NULL COMMENT '图标',
  `METHOD` varchar(50) DEFAULT NULL COMMENT '菜单链接',
  `KEY_NAME` varchar(30) DEFAULT NULL COMMENT '菜单标识',
  `ADD_USER` int(11) NOT NULL COMMENT '添加人',
  `ADD_TIME` bigint(13) NOT NULL COMMENT '添加时间',
  `UPDATE_USER` int(11) DEFAULT NULL COMMENT 'UPDATE_USER',
  `UPDATE_TIME` bigint(13) DEFAULT NULL COMMENT '更新时间',
  `ABLE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '0:disable;1:enable',
  `DELETE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '0:deleted;1:normal',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9401 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('1000', '基础信息管理', '0', '100', 'icon-merchant', '', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('1100', '客户信息管理', '1000', '101', 'icon-star', 'LoadCustomer', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('2000', '报表', '0', '200', ' fa-bar-chart-o', '/baobiao.html', 'menu_baobiao', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('9000', '行政管理', '0', '900', 'fa-cog', ' ', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('9100', '员工信息管理', '9000', '901', 'icon-user', 'LoadUser', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('9200', '组织架构管理', '9000', '902', 'icon-submerchant', 'LoadDepart', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('9300', '职务信息管理', '9000', '903', 'icon-submerchant', 'LoadPosition', ' ', '0', '0', null, null, '1', '1');
INSERT INTO `menu` VALUES ('9400', '系统角色管理', '9000', '904', 'fa-reorder', '/general/role.html', 'menu_role', '0', '0', null, null, '1', '1');

-- ----------------------------
-- Table structure for menu_fun
-- ----------------------------
DROP TABLE IF EXISTS `menu_fun`;
CREATE TABLE `menu_fun` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `MENU_ID` int(11) NOT NULL COMMENT '菜单ID',
  `FUN_ID` int(11) NOT NULL COMMENT '功能ID',
  `FUN_NAME` varchar(32) NOT NULL COMMENT '功能名称',
  `COMMENTS` varchar(256) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu_fun
-- ----------------------------
INSERT INTO `menu_fun` VALUES ('1', '1100', '1', '添加', '');
INSERT INTO `menu_fun` VALUES ('2', '1100', '2', '修改', '');
INSERT INTO `menu_fun` VALUES ('3', '1100', '3', '删除', '');
INSERT INTO `menu_fun` VALUES ('20', '9100', '1', '添加', '');
INSERT INTO `menu_fun` VALUES ('21', '9100', '2', '修改', '');
INSERT INTO `menu_fun` VALUES ('22', '9100', '3', '删除', '');
INSERT INTO `menu_fun` VALUES ('23', '9100', '4', '配置角色', '');
INSERT INTO `menu_fun` VALUES ('24', '9400', '1', '添加', '');
INSERT INTO `menu_fun` VALUES ('25', '9400', '2', '修改', '');
INSERT INTO `menu_fun` VALUES ('26', '9400', '3', '删除', '');
INSERT INTO `menu_fun` VALUES ('27', '9400', '4', '配置权限', '');
INSERT INTO `menu_fun` VALUES ('28', '9200', '1', '添加', null);
INSERT INTO `menu_fun` VALUES ('29', '9200', '2', '修改', null);
INSERT INTO `menu_fun` VALUES ('30', '9200', '3', '删除', null);
INSERT INTO `menu_fun` VALUES ('31', '9300', '1', '添加', null);
INSERT INTO `menu_fun` VALUES ('32', '9300', '2', '修改', null);
INSERT INTO `menu_fun` VALUES ('33', '9300', '3', '删除', null);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ROLE_NAME` varchar(30) NOT NULL COMMENT '角色名称',
  `COMMENTS` varchar(300) DEFAULT NULL COMMENT '备注',
  `ADD_USER` int(11) NOT NULL COMMENT '添加人',
  `ADD_TIME` bigint(13) NOT NULL COMMENT '添加时间',
  `UPDATE_USER` int(11) DEFAULT NULL COMMENT '更新人',
  `UPDATE_TIME` bigint(13) DEFAULT NULL COMMENT '更新时间',
  `ABLE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '0:disable;1:enable',
  `DELETE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '0:deleted;1:normal',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '超级管理员', '超级管理员', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('2', '系统管理员', '系统管理员', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('4', '市场部经理', '市场部权限最大的人', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('5', '市场部销售精英', '市场部的销售精英', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('6', '设计部经理', '设计部权限最大的人', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('7', '设计部设计师', '设计部的设计师', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('8', '工程部经理', '工程部权限最大的人', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('9', '工程部工程师', '工程部的工程师', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('10', '行政部经理', '行政部权限最大的人', '0', '0', null, null, '1', '1');
INSERT INTO `role` VALUES ('11', '行政部职员', '行政部的职员', '0', '0', null, null, '1', '1');

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ROLE_ID` int(11) NOT NULL COMMENT '角色ID',
  `MENU_ID` int(11) NOT NULL COMMENT '菜单ID',
  `FUNBIT` varchar(30) DEFAULT NULL COMMENT '功能位',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES ('3', '1', '9000', '0000000000');
INSERT INTO `role_menu` VALUES ('4', '1', '9100', '1111000000');
INSERT INTO `role_menu` VALUES ('5', '1', '9400', '1111000000');
INSERT INTO `role_menu` VALUES ('6', '2', '1000', '0000000000');
INSERT INTO `role_menu` VALUES ('7', '2', '1100', '1110000000');
INSERT INTO `role_menu` VALUES ('8', '2', '9000', '0000000000');
INSERT INTO `role_menu` VALUES ('9', '2', '9100', '1110000000');
INSERT INTO `role_menu` VALUES ('10', '2', '9200', '1110000000');
INSERT INTO `role_menu` VALUES ('11', '2', '9300', '1110000000');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_NO` varchar(10) NOT NULL COMMENT '工号  ',
  `COMPANY` varchar(60) DEFAULT NULL COMMENT '合同公司',
  `FULL_NAME` varchar(20) DEFAULT NULL COMMENT '姓名 ',
  `NAME_CODE` varchar(60) DEFAULT NULL COMMENT '姓名全拼',
  `USER_PWD` varchar(120) NOT NULL COMMENT '用户密码',
  `IDENTIFICATION` varchar(20) DEFAULT NULL COMMENT '身份证',
  `EMAIL` varchar(60) DEFAULT NULL COMMENT '邮箱',
  `MOBILE` varchar(20) DEFAULT NULL COMMENT '移动通讯',
  `TELEPHONE` varchar(20) DEFAULT NULL COMMENT '座机',
  `MARRY_FLAG` char(1) DEFAULT '0' COMMENT '未婚=0 已婚=1',
  `QQ` varchar(20) DEFAULT NULL COMMENT '腾讯QQ',
  `POSITION` int(11) DEFAULT '1' COMMENT '职位',
  `USER_RANK` int(11) DEFAULT '1' COMMENT '职级',
  `JOIN_DATE` bigint(13) DEFAULT NULL COMMENT '入职日期 ',
  `REGULARIZE_DATE` bigint(13) DEFAULT NULL COMMENT '转正日期',
  `CONTR_BEGIN_DATE` bigint(13) DEFAULT NULL COMMENT '合同开始 ',
  `CONTR_END_DATE` bigint(13) DEFAULT NULL COMMENT '合同结束 ',
  `GENDER` char(1) DEFAULT '1' COMMENT '性别 0：女；1：男',
  `USER_REGION` varchar(20) DEFAULT NULL COMMENT '户籍',
  `OCCUP_STATE` char(1) DEFAULT '1' COMMENT '离职=0 在职=1',
  `DEPART` int(11) DEFAULT '1' COMMENT '所属部门 ',
  `WORK_PLACE` varchar(30) DEFAULT NULL COMMENT '工作地',
  `AVATAR` varchar(30) DEFAULT NULL COMMENT '头像 ',
  `BIRTHDAY` bigint(13) DEFAULT NULL COMMENT '生日',
  `PWD_LAST_SET` bigint(13) DEFAULT NULL COMMENT '上次密码修改时间',
  `COMMENTS` varchar(300) DEFAULT NULL COMMENT '备注信息',
  `ADD_USER` int(11) NOT NULL COMMENT '添加人',
  `ADD_TIME` bigint(13) NOT NULL COMMENT '添加时间',
  `UPDATE_USER` int(11) DEFAULT NULL COMMENT '更新人',
  `UPDATE_TIME` bigint(13) DEFAULT NULL COMMENT '更新时间',
  `ENABLE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '禁用=0 可用=1',
  `DELETE_FLAG` char(1) NOT NULL DEFAULT '1' COMMENT '删除=0 未删除=1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='员工信息';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'super', '', '超级管理员', null, '21218cca77804d2ba1922c33e0151105', null, 'super@qq.com', null, null, '1', null, '1', '1', '1401062400000', '1401321600000', null, null, '0', null, '1', '2', null, null, null, null, null, '0', '0', null, null, '1', '');
INSERT INTO `user` VALUES ('2', 'admin', null, '系统管理员', null, '21218CCA77804D2BA1922C33E0151105', null, 'admin@qq.com', null, null, '0', null, '0', '0', '1404950400000', '1405641600000', null, null, '0', null, '0', '4', null, null, null, null, null, '0', '0', null, null, '1', '');
INSERT INTO `user` VALUES ('3', 'zhangxue', null, '张学友', null, '21218CCA77804D2BA1922C33E0151105', null, 'zhangxueyou@qq.com', null, null, '0', null, '0', '0', '1404950400000', '1406246400000', null, null, '0', null, '0', '5', null, null, null, null, null, '0', '0', null, null, '1', '');
INSERT INTO `user` VALUES ('4', 'liming', null, '黎明', null, '21218CCA77804D2BA1922C33E0151105', null, 'liming@126.com', null, null, '0', null, '0', '0', '1405382400000', '1406160000000', null, null, '0', null, '0', '2', null, null, null, null, null, '0', '0', null, null, '1', '');
INSERT INTO `user` VALUES ('5', 'zhengyij', null, '郑伊健', null, '21218CCA77804D2BA1922C33E0151105', null, 'zhengyijian@hotmail.com', null, null, '0', null, '0', '0', '1405468800000', '1406160000000', null, null, '0', null, '0', '2', null, null, null, null, null, '0', '0', null, null, '1', '');
INSERT INTO `user` VALUES ('6', 'liangyon', null, '梁咏琪', null, '21218CCA77804D2BA1922C33E0151105', null, 'liangyongqi@gmail.com', null, null, '0', null, '0', '0', '1404777600000', '1406678400000', null, null, '0', null, '0', '2', null, null, null, null, null, '0', '0', null, null, '1', '');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_ID` int(11) NOT NULL COMMENT '用户ID',
  `ROLE_ID` int(11) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('1', '1', '1');
INSERT INTO `user_role` VALUES ('2', '1', '3');
INSERT INTO `user_role` VALUES ('3', '2', '2');
INSERT INTO `user_role` VALUES ('4', '3', '6');
