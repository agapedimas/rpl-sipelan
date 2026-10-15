CREATE TABLE IF NOT EXISTS Authentication (
    id INT UNSIGNED AUTO_INCREMENT,
    accountId INT UNSIGNED NOT NULL,
    ipAddress VARCHAR(45)
        CHARACTER SET ascii COLLATE ascii_bin
        NOT NULL,
    time BIGINT NOT NULL,

    FOREIGN KEY (accountId)
        REFERENCES Account(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    PRIMARY KEY (id, accountId),
    INDEX (accountId, time)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;