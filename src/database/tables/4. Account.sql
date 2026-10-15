CREATE TABLE IF NOT EXISTS Account (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) 
        CHARACTER SET ascii COLLATE ascii_bin 
        NOT NULL,
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

    INDEX (districtId),
    INDEX (role)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_bin;