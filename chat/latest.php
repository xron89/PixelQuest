<?php

require_once 'db.php';

$messages = $db->query("
    SELECT name, message
    FROM messages
    ORDER BY created ASC
    LIMIT 50
");

header('Content-Type: application/json');

echo json_encode(
    $messages->fetchAll(PDO::FETCH_OBJ)
);