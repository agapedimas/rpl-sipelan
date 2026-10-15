CREATE TABLE IF NOT EXISTS PartOfReport (
    reportId INT UNSIGNED NOT NULL,
    submissionId INT UNSIGNED NOT NULL,

    FOREIGN KEY (reportId)
        REFERENCES Report(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (submissionId)
        REFERENCES Submission(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    PRIMARY KEY (reportId, submissionId),
    UNIQUE KEY (submissionId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;