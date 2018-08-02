<?php

include "ajax.php";


?>
<!DOCTYPE html>
<html>
<head>
  <style type="text/css">
canvas {
}
  </style>
  <link rel="stylesheet" href="style.css" type="text/css" />
  <script type="text/javascript" src="jquery.min.js"></script>
  <script type="text/javascript" src="panel.js"></script>
  <script type="text/javascript">

$(function() {

  $("button").click(function() {

    switch (this.value) {
    case 'clear':
      Panel.Canvas.clear();
      break;

    case 'fill':
      Panel.Canvas.clear(true);
      break;

    case 'invert':
      Panel.Canvas.invert(true);
      break;

    case 'acquire':
      Panel.Remote.acquire();
      break;

    case 'publish':
      Panel.Remote.publish();
      break;
      
    case 'save':
      var bits = Panel.Canvas.acquire();
      var data = Panel.Data.pack(bits);
      $("#datadump").val(data);

      Panel.CanvasPreview.draw(bits);

      break;

    case 'load':
      var data = Panel.Data.unpack($("#datadump").val());
      Panel.Canvas.draw(data);
      break;
    }

    return false;
  });

  $("a.canvas-data")
    .on("mouseover", function() {
      var m = $(this).attr("href").match(/[?&]d=([a-fA-F0-9]+)(&|$)/);
      if (m) {
        console.log("mouse over link");
        var bits = Panel.Data.unpack(m[1]);
        Panel.CanvasPreview.draw(bits);
      }
    })
    .on("click", function() {
      var m = $(this).attr("href").match(/[?&]d=([a-fA-F0-9]+)(&|$)/);
      if (m) {
        console.log("mouse over link");
        var bits = Panel.Data.unpack(m[1]);
        Panel.Canvas.draw(bits);
        return false;
      }
    });
});


  </script>
</head>
<body>

<div class="gui-panel">
  <h1>Cool flip panel GUI</h1>
  <div class="gui-panel-buttons">
    <button type="button" name="action" value="acquire" class="action acquire-btn"><img src="icons/baseline-save_alt-24px.svg" /> Acquire</button>
    <button type="button" name="action" value="publish" class="action publish-btn"><img src="icons/baseline-input-24px.svg" /> Send!</button>
  </div>

  <div class="gui-panel-canvas">
    <canvas id="flip" width="900" height="240" style="border: 10px solid #7f7f7f; "></canvas>
  </div>

<button type="button" name="action" value="fill">Fill</button>
<button type="button" name="action" value="clear">Clear</button>
<button type="button" name="action" value="invert">Invert</button>

<br />
<br />

<div class="gui-saved-panel">
  <ul class="gui-saved-list">
    <li><a href="#">Saved entry 1</a><a href="#">delete</a></li>
    <li><a href="#">Saved entry 2</a><a href="#">delete</a></li>
  </ul>
</div>

<div>
  <textarea id="datadump" cols="60" rows="20"></textarea>
  <button type="button" name="action" value="save">Save</button>
  <button type="button" name="action" value="load">Load</button>
</div>

<canvas id="preview" width="90" height="24" style="border: 2px solid #7f7f7f;"></canvas>

<br />
<a href="?d=000000000000F8FB01040A03040C060404040406040C0604F81F06C0300260E001202000202000102000102000102000F81100181A00080E00C80400580200700100E00000000000000000400000600000200000300000100000100000100000900100900000800000400000400000600000200000200000200000200000200000000000000100000100800000800000800000400000400000400000400000400000400000400000000000000000000000000000E00700200400200500200700000000000000E00700000000000000E00700200100200100E00100000000E00700200100200100E00100000000E00700200400200400E00700000000000000000000000000000000000000000000" class="canvas-data">gippo</a><br /><br />
<a href="?d=FFFFFF0100800500A00900901100882100844100828100810181800142800124800118800118800124800142800181808100814100822100841100880900900500A0010080FFFFFF000000000000FFFFFF000000FFFFFF000000FFFFFF000000000000FFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000555555555555AAAAAAAAAAAA0000000000000000800000400000202400103E00082000840000C200006100803000401800200C00108600084300842100C210006108803004401802200C0110860408437C842104C2100061087C3004541802440C010086005C43005421007410000008000404007C020004010000" class="canvas-data">test screen 1</a>

</div>
</body>
</html>
