CREATE TABLE IF NOT EXISTS Log (
    id INT UNSIGNED AUTO_INCREMENT,
    value TEXT NOT NULL,
    time BIGINT NOT NULL,
    picture LONGBLOB NULL,

    reporterId INT UNSIGNED NOT NULL,
    logCategoryId INT UNSIGNED NOT NULL,
    reportId INT UNSIGNED NOT NULL,

    FOREIGN KEY (reporterId)
        REFERENCES Account(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (logCategoryId)
        REFERENCES LogCategory(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (reportId)
        REFERENCES Report(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    
    PRIMARY KEY (id),

    INDEX (reportId, time),
    INDEX (reporterId),
    INDEX (logCategoryId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;