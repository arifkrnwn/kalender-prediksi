SELECT 
    t.`tgl_pickup` AS `Tanggal Pickup`,
    `f_nama_customer`(t.`kode_customer`) AS `Nama Customer`,
    `f_nama_customer_location`(t.`kode_customer_location`) AS `Lokasi Pickup`,
    SUM(t.`qty_from_do`) AS `Koli`,
    SUM(t.`berat_kg`) AS `Berat`,
    SUM(t.`biaya_total`) AS `Revenue`
FROM 
    `logistik_tbarang` t
WHERE 
    t.`tgl_pickup` >= DATE_SUB(CURDATE(), INTERVAL 2 YEAR) 
    AND t.`kode_unker` = 'kp'
    AND t.`kode_customer` IN (
        "VITA",
        "PAN",
        "PRI",
        "MAP",
        "EMWAY",
        "VOLANS"
    )
    AND t.`kode_customer_location` IN (
        "VITAWHO",
        "PANWHO",
        "PNTUMK",
        "PRIDIST",
        "MAPGPWHO",
        "MAPLKED",
        "EMWWHO",
        "WHOVOLANS"
    )
GROUP BY 
    t.`tgl_pickup`, t.`kode_customer`, t.`kode_customer_location`;
