CREATE TABLE IF NOT EXISTS Submission (
    id INT UNSIGNED AUTO_INCREMENT,
    description TEXT NOT NULL,
    time BIGINT NOT NULL,
    picture LONGBLOB NULL,
    isArchived BOOLEAN NOT NULL DEFAULT FALSE,

    districtId INT UNSIGNED NOT NULL,
    citizenId INT UNSIGNED NOT NULL,
    disasterTypeId INT UNSIGNED NOT NULL,

    FOREIGN KEY (districtId)
        REFERENCES District(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (citizenId)
        REFERENCES Account(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (disasterTypeId)
        REFERENCES DisasterType(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    PRIMARY KEY (id),

    INDEX (citizenId, time),
    INDEX (districtId),
    INDEX (disasterTypeId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;