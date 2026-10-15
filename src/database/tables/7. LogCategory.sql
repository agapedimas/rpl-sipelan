CREATE TABLE IF NOT EXISTS LogCategory (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    type ENUM('string', 'number', 'boolean') NOT NULL,
    unit VARCHAR(64) NULL,

    PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;