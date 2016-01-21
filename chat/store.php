<?php

require_once 'db.php';

if (isset($_POST['message'])) {
    $message = $_POST['message'];
    
    $store = $db->prepare("
        INSERT INTO messages (name, message)
        VALUES (:name, :message)
    ");

    $store->execute([
        'name' => $message['name'],
        'message' => $message['message']
    ]);

    $pusher->trigger('chat', 'chat_message', [
        'name' => $message['name'],
        'message' => $message['message']
    ]);
}