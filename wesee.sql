/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80034
 Source Host           : localhost:3306
 Source Schema         : wesee

 Target Server Type    : MySQL
 Target Server Version : 80034
 File Encoding         : 65001

 Date: 29/12/2023 22:59:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comment_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `video_id` int(0) NULL DEFAULT NULL,
  `commentText` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (1, 1, 1, '<p>鱼鱼的第一个评论哦😀</p>');
INSERT INTO `comments` VALUES (2, 1, 2, '<h1 style=\"text-align: center;\"><span style=\"background-color: rgb(231, 95, 51);\"><u><strong>jisoo的第一个评论🤡</strong></u></span></h1><p> &nbsp; 今天很开心，这是富文本编辑器......</p>');
INSERT INTO `comments` VALUES (3, 1, 2, '<p>jisoo的第二个评论哦😎</p>');
INSERT INTO `comments` VALUES (4, 1, 2, '<p><br></p>');
INSERT INTO `comments` VALUES (5, 2, 1, '<p>这个鲸鱼......</p><p>🤡</p>');
INSERT INTO `comments` VALUES (6, 2, 3, '<p>棒子的评论😇</p>');
INSERT INTO `comments` VALUES (7, 2, 4, '<p>仙人掌小日子😤</p>');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `age` int(0) NULL DEFAULT NULL,
  `gender` int(0) NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nationality` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username_unique`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '李向阳', '$2a$10$yk9opAAYwrmxuxswwz1K4OzpiH5XUMXx6YpRW4owAxfa/Z.ZOd0J6', '2327296384@qq.com', NULL, 'profilephoto.jpg', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (2, 'Lee', '$2a$10$7uybXglD.myBVEp75xuN/uRQNfffZrvbWRAVmExmgcuPNcOeh0S/m', '123@qq.com', NULL, 'b23.jpeg', NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for userslike
-- ----------------------------
DROP TABLE IF EXISTS `userslike`;
CREATE TABLE `userslike`  (
  `userlike_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NOT NULL,
  `video_id` int(0) NOT NULL,
  PRIMARY KEY (`userlike_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userslike
-- ----------------------------
INSERT INTO `userslike` VALUES (1, 1, 1);
INSERT INTO `userslike` VALUES (2, 1, 2);
INSERT INTO `userslike` VALUES (3, 1, 2);
INSERT INTO `userslike` VALUES (4, 2, 1);
INSERT INTO `userslike` VALUES (5, 2, 1);
INSERT INTO `userslike` VALUES (6, 2, 2);
INSERT INTO `userslike` VALUES (7, 2, 2);
INSERT INTO `userslike` VALUES (8, 2, 3);
INSERT INTO `userslike` VALUES (9, 2, 3);
INSERT INTO `userslike` VALUES (10, 2, 4);
INSERT INTO `userslike` VALUES (11, 2, 8);
INSERT INTO `userslike` VALUES (12, 2, 8);

-- ----------------------------
-- Table structure for videos
-- ----------------------------
DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos`  (
  `video_id` int(0) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `release_time` datetime(0) NULL DEFAULT NULL,
  `main_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` int(0) NULL DEFAULT NULL,
  `user_id` int(0) NOT NULL,
  `video` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `like` int(0) NOT NULL DEFAULT 0,
  `comment` int(0) NULL DEFAULT 0,
  PRIMARY KEY (`video_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of videos
-- ----------------------------
INSERT INTO `videos` VALUES (1, 'y鱼鱼', '2023-12-29 22:40:15', 'background.png', NULL, 1, 'fish.mp4', 3, 2);
INSERT INTO `videos` VALUES (2, 'jisoo', '2023-12-29 22:42:04', 'jisoo.jpeg', NULL, 1, 'jisoo.mp4', 4, 3);
INSERT INTO `videos` VALUES (3, '棒子', '2023-12-29 22:54:59', 'b20.jpeg', NULL, 2, 'luvssulii.mp4', 2, 1);
INSERT INTO `videos` VALUES (4, '小日子', '2023-12-29 22:56:14', 'b5.jpeg', NULL, 2, 'sakimotosae.mp4', 1, 1);
INSERT INTO `videos` VALUES (8, '管理员编辑测试', '2023-12-29 22:57:41', 'b5.jpeg', NULL, 2, 'sakimotosae.mp4', 2, 0);

SET FOREIGN_KEY_CHECKS = 1;
