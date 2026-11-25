CREATE TABLE IF NOT EXISTS Account (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    nik VARCHAR(32)
        CHARACTER SET ascii COLLATE ascii_bin,
    picture LONGBLOB NULL,
    phone VARCHAR(32) NOT NULL,
    role ENUM('citizen', 'volunteer', 'officer', 'admin')
        NOT NULL,
    districtId INT UNSIGNED NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (districtId)
        REFERENCES District(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        
    PRIMARY KEY (id),
    UNIQUE KEY (nik),
    UNIQUE KEY (phone),

    INDEX (nik),
    INDEX (phone)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;

CREATE OR REPLACE VIEW AccountView AS
SELECT
    id, 
    name, 
    nik,
    phone, 
    role,
    districtId,
    (
        SELECT
            displayName
        FROM
            Domicile d
        WHERE
            d.districtId = a.districtId
    ) AS domicile,
    isActive
FROM
    Account a
ORDER BY name;