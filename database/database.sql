CREATE USER 'synerunify'@'localhost' IDENTIFIED BY 'synerunify';
CREATE USER 'synerunify'@'%' IDENTIFIED BY 'synerunify';

CREATE DATABASE IF NOT EXISTS synerunify DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL ON synerunify.* TO 'synerunify'@'localhost';
GRANT ALL ON synerunify.* TO 'synerunify'@'%';