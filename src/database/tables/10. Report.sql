CREATE TABLE IF NOT EXISTS Report (
    id INT UNSIGNED AUTO_INCREMENT,
    isArchived BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM(
        'closed',
        'handlingRequired',
        'noHandlingRequired'
    ) NOT NULL,
    description TEXT NOT NULL,
    time BIGINT NOT NULL,

    disasterTypeId INT UNSIGNED NOT NULL,

    FOREIGN KEY (disasterTypeId)
        REFERENCES DisasterType(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    
    PRIMARY KEY (id),

    INDEX (disasterTypeId),
    INDEX (status)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;

CREATE OR REPLACE VIEW ReportView AS
SELECT 
    r.*,
    `districtId`
FROM 
    Report r LEFT JOIN Partofreport p
        ON r.id = p.id
    LEFT JOIN submission s
        ON p.`submissionId` = s.`submissionId`
