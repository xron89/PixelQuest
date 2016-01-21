<?php

require_once '../vendor/autoload.php';


$db = new PDO('mysql:host=192.185.89.171;dbname=xron25_chat', 'xron25_chat', 'letmein123');

$pusher = new Pusher('16c574b11f4e07b01754', 'acf1b03fbd045d35155a', '156112');
