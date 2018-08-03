<?php

function do_transmit($data) {
  $fd = @fopen("data.bin", "r+");
  if ($fd === false)
    return false;

  if (flock($fd, LOCK_EX | LOCK_NB)) {
    ftruncate($fp, 0);
    fwrite($fd, data);

    $inv_data = invert_data($data);
    // system("stty 156200 cs8 -parenb -cstopb ixon -F /dev/ttyUSB0");
    // $usb = fopen("/dev/ttyUSB0", "w");
    // fwrite($usb, "d" . $data);
    // fclose($usb);
    sleep(5);

    flock($fd, LOCK_UN);
    fclose($fd);
    return true;
  }
  else {
    fclose($fd);
    return false;
  }
}

function action_publish() {
  $data = (isset($_POST['d']) ? (string) $_POST['d'] : null);

  if (preg_match('/^[a-fA-F0-9]{540}$/', $data)) {
    // @file_put_contents("data.bin", $data);
    $retval = do_transmit($data);
    if (!$retval) {
      header("HTTP/ 400 Bad Request");
      header("Content-Type: text/plain");
      print "Error: Panel is busy\n";
    }
  }
  else {
    header("HTTP/ 400 Bad Request");
    header("Content-Type: text/plain");
    print "Error: Invalid data format\n";
  }
}

function action_acquire() {
  $data = @file_get_contents("data.bin");

  header("Content-Type: text/plain");
  print $data;
}

function invert_data($data) {
  if (!preg_match('/^[a-fA-F0-9]{540}$/', $data))
    return false;

  $retval = "";
  for ($i = 0; $i < 540; $i += 6) {
    $col_hex = substr($data, $i, 6);
    $col_hex_rev = "";
    // var_dump($col_hex);
    for ($j = 0; $j < 6; $j += 2) {
      $byte = hexdec(substr($col_hex, $j, 2));
      // var_dump($byte);
      $newbyte = 0;
      for ($q = 0; $q < 8; $q++) {
        $newbyte <<= 1;
        $newbyte |= ($byte & 1);
        $byte >>= 1;
      }
      $col_hex_rev .= sprintf("%02X", $newbyte);
    }
    $retval .= $col_hex_rev;
  }
  // var_dump($retval);

  return $retval;
}

function action_render() {
  include "graph.inc.php";
  $text = @$_POST['t'];

  header("Content-Type: text/plain");
  $g = new GraphLib(90, 24);
  $g->addText($text);
  print $g->getPackedData();
}

if (!empty($_GET['a'])) {
  $action = $_GET['a'];

  if ($action == "acquire") {
    action_acquire();
  }
  if ($action == "publish") {
    action_publish();
  }
  if ($action == "render") {
    action_render();
  }
  if ($action == "invert_bits") {
    $d = @$_GET['d'];

    header("Content-Type: text/plain");
    $d = invert_data($d);
    print $d;
  }

  exit();
}
