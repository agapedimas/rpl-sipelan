CREATE OR REPLACE VIEW Domicile AS
SELECT
    d.id AS districtId, 
    d.name AS districtName, 
    c.id AS cityId,
    c.name AS cityName, 
    p.id AS provinceId,
    p.name AS provinceName,
    d.postalCode AS postalCode,
    CONCAT(d.name, ', ', c.name, ', ', p.name, ' ', d.postalCode) AS displayName
FROM
    District d
    LEFT JOIN City c ON c.id = d.cityId
    LEFT JOIN Province p ON p.id = c.provinceId;