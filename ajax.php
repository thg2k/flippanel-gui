<?php

function action_publish() {
  $data = (isset($_POST['d']) ? (string) $_POST['d'] : null);

  if (preg_match('/^[a-fA-F0-9]{540}$/', $data)) {
    @file_put_contents("data.bin", $data);
  }
  else {
    header("HTTP/ 400 Bad Request");
    header("Content-Type: text/plain");
    print "Error: Invalid data format\n";
  }

  exit();
}

function action_acquire() {
  $data = @file_get_contents("data.bin");

  header("Content-Type: text/plain");
  print $data;
  exit();
}

if (!empty($_GET['a'])) {
  $action = $_GET['a'];

  if ($action == "acquire") {
    action_acquire();
  }
  if ($action == "publish") {
    action_publish();
  }
}
