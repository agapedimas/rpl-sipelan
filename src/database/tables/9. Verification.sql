CREATE TABLE IF NOT EXISTS Verification (
    id INT UNSIGNED AUTO_INCREMENT,
    status ENUM('verified', 'rejected') NOT NULL,
    time BIGINT NOT NULL,
    reason TEXT NOT NULL,

    submissionId INT UNSIGNED NOT NULL,
    verifierId INT UNSIGNED NOT NULL,

    FOREIGN KEY (submissionId)
        REFERENCES Submission(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (verifierId)
        REFERENCES Account(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    PRIMARY KEY (id),

    INDEX (submissionId, time),
    INDEX (verifierId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;