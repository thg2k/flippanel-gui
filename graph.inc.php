<?php

class GraphLib {

  private $_im;
  private $_c_bg;
  private $_c_main;

  public function __construct($width, $height) {
    $this->_im = imagecreate($width, $height);
    $this->_c_bg = imagecolorallocate($this->_im, 0, 0, 0);
    $this->_c_main = imagecolorallocate($this->_im, 255, 0, 255);

// imagesetpixel($this->_im, 0, 0, $this->_c_main);
  }

  public function getPackedData() {
    $retval = "";
    $val = 0;
    $xbit = 0;
    for ($i = 0; $i < imagesx($this->_im); $i++) {
      for ($j = 0; $j < imagesy($this->_im); $j++) {
        $px = imagecolorat($this->_im, $i, $j);
        // $val |= ($px ? 1 : 0) << (7 - $xbit);
        $val |= ($px ? 1 : 0) << $xbit;
        $xbit++;
        if ($xbit == 8) {
          $token = sprintf("%02X", $val);
// var_dump($token);
          $retval .= $token;
          $val = 0;
          $xbit = 0;
        }
      }
    }
// var_dump($retval);
    return $retval;
  }

  public function addText($text) {
    $r = imagettftext($this->_im, 12, 0, 0, 19, $this->_c_main, "./subway-ticker.regular.ttf", $text);
// var_dump($r);
  }

  public function render() {
    header("Content-Type: image/png");
    imagepng($this->_im);
  }
}

// if ($view
// header("Content-Type: text/plain");

// $g = new GraphLib(90, 24);

// $g->addText("Ciao!");


// if (@$_GET['view'] == "data")
  // $g->getPackedData();
// else
  // $g->render();
