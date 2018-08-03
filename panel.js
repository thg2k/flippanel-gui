
Panel = {};

Panel.element = null;

Panel.ctx = null;

Panel.COLS = 90;

Panel.ROWS = 24;

Panel.DataNew = {

  /**
   * ...
   *
   * @param {array} bits ...
   * @return {string} ...
   */
  pack: function(bits) {
    console.log("Panel.Data.pack() bits.length=" + bits.length);

    /* pad the bits */
    while (bits.length % Panel.ROWS) {
      // console.log("padding the bits (current: " + bits + ")");
      bits.push(0);
    }

    var hex = "";
    var row_hex = "";
    var n = 0;
    var xbit = 0;

    for (var i = 0; i < bits.length; i++) {
      /* push this bit */
      // console.log("processing i=" + i + " bit=" + bits[i] + " (n=" + n + ")");
      n <<= 1;
      if (bits[i])
        n |= 1;
      xbit++;

      // console.log(".. now n = " + n);
      if ((xbit % 8) == 0) {
        row_hex = n.toString(16).toUpperCase().padStart(2, "0") + row_hex;
        // console.log(".. pushed hex=" + hex);
        n = 0;
      }

      if (xbit == Panel.ROWS) {
        hex += row_hex
        row_hex = 0;
        xbit = 0;
      }
    }

    return hex;
  },

  /**
   * ...
   *
   * @param {string} hex ...
   * @return {array} ...
   */
  unpack: function(hex) {
    console.log("Panel.Data.unpack() hex=\"" + hex + "\"");
    var bits = [];

    for (var i = 0; i < hex.length; i += 2) {
      var n = parseInt(hex.substr(i, 2), 16);
      // console.log("unpacking ", n);
      for (var bit = 0; bit < 8; bit++) {
        var bval = n & (1 << bit);
        // console.log("pushing ", n, n & 1);
        bits.push(bval);
      }
    }

    return bits;
  },
};

Panel.Data = {
  pack: function(bits) {
    console.log("Panel.Data.pack() bits.length=" + bits.length);

    /* pad the bits */
    while (bits.length % 8) {
      // console.log("padding the bits (current: " + bits + ")");
      bits.push(0);
    }

    var hex = "";
    var n = 0;
    var xbit = 0;

    for (var i = 0; i < bits.length; i++) {
      /* push this bit */
      // console.log("processing i=" + i + " bit=" + bits[i] + " (n=" + n + ")");
      if (bits[i])
        n |= (1 << xbit);
      xbit++;

      // console.log(".. now n = " + n);
      if (xbit == 8) {
        hex += n.toString(16).toUpperCase().padStart(2, "0");
        // console.log(".. pushed hex=" + hex);
        n = 0;
        xbit = 0;
      }
    }

    return hex;
  },

  unpack: function(hex) {
    console.log("Panel.Data.unpack() hex=\"" + hex + "\"");
    var bits = [];

    for (var i = 0; i < hex.length; i += 2) {
      var n = parseInt(hex.substr(i, 2), 16);
      // console.log("unpacking ", n);
      for (var bit = 0; bit < 8; bit++) {
        var bval = n & 1;
        // console.log("pushing ", n, n & 1);
        bits.push(n & 1);
        n >>= 1;
      }
    }

    return bits;
  },
};


Panel.CanvasPreview = {
  /**
   * ...
   */
  element: null,

  /**
   * ...
   */
  draw: function(bits) {
    var ctx = this.element.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.element.width, this.element.height);

    ctx.fillStyle = "#f4ec11";
    for (var x = 0; x < Panel.COLS; x++) {
      for (var y = 0; y < Panel.ROWS; y++) {
        var val = !!bits[x * Panel.ROWS + y];
        if (val)
          ctx.fillRect(x, y, 1, 1);
      }
    }
  },
};

/**
 * ...
 */
Panel.Canvas = {
  /**
   * Reads a single pixel value
   *
   * Note that this is way slower than reading all data at once using acquire()
   *
   * @param {coords} coords ...
   * @return {boolean} ...
   */
  get_pixel: function(coords) {
    var real_x = coords.x * 10;
    var real_y = coords.y * 10;

    var d = Panel.ctx.getImageData(real_x + 3, real_y + 3, 1, 1).data;
    return (d[0] > 80);
  },

  /**
   * Draws a single pixel
   *
   * @param {coords} coords ...
   * @param {boolean} enabled ...
   */
  draw_pixel: function(coords, active) {
    var real_x = coords.x * 10;
    var real_y = coords.y * 10;
    // console.log("DRAWING X=",real_x, "Y=",real_y);

    var ctx = Panel.ctx;
    if (active) {
      ctx.fillStyle = "#fff600";
      ctx.fillRect(real_x, real_y, 10, 10);

      ctx.fillStyle = "#f4ec11";
      ctx.fillRect(real_x, real_y, 9, 9);

      ctx.strokeStyle = "#e5dd00";
      // ctx.strokeStyle = "#ff00ff";
      ctx.beginPath()
      ctx.moveTo(real_x + 9.5, real_y + 0.5);
      ctx.lineTo(real_x + 0.5, real_y + 0.5);
      ctx.lineTo(real_x + 0.5, real_y + 9.5);
      ctx.closePath()
      ctx.stroke();
    }
    else {
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(real_x, real_y, 10, 10);

      ctx.fillStyle = "#292929";
      ctx.fillRect(real_x, real_y, 9, 9);

      ctx.fillStyle = "#000000";
      ctx.fillRect(real_x, real_y, 8, 8);

      ctx.strokeStyle = "#1e1e1e";
      ctx.beginPath()
      ctx.moveTo(real_x + 9.5, real_y + 0.5);
      ctx.lineTo(real_x + 0.5, real_y + 9.5);
      ctx.closePath()
      ctx.stroke();
    }
  },

  /**
   * Clears the whole canvas
   *
   * @param {boolean} fill ...
   */
  clear: function(fill) {
    for (var x = 0; x < Panel.COLS; x++) {
      for (var y = 0; y < Panel.ROWS; y++) {
        Panel.Canvas.draw_pixel({ x: x, y: y }, !!fill);
      }
    }
  },

  /**
   * Inverts the panel drawing
   */
  invert: function() {
    var d = Panel.ctx.getImageData(0, 0, Panel.element.width, Panel.element.height).data;
    for (var y = 0; y < Panel.ROWS; y++) {
      for (var x = 0; x < Panel.COLS; x++) {
        var data_offset = ((y * 10 + 3) * Panel.element.width * 4 + (x * 10 + 3) * 4);
        var cc = (d[data_offset] > 80);
        // console.log(" Px("+x+","+y+")[" + data_offset + "]="+cc);
        Panel.Canvas.draw_pixel({ x: x, y: y }, !cc);
      }
    }
  },

  /**
   * ...
   *
   * @return {array} ...
   */
  acquire: function() {
    var d = Panel.ctx.getImageData(0, 0, Panel.element.width, Panel.element.height).data;
    var bits = [];
    for (var x = 0; x < Panel.COLS; x++) {
      for (var y = 0; y < Panel.ROWS; y++) {
        var data_offset = ((y * 10 + 3) * Panel.element.width * 4 + (x * 10 + 3) * 4);
        var cc = (d[data_offset] > 80);
        bits.push(Number(cc));
      }
    }
    return bits;
  },

  /**
   * Draws a data bits array onto the panel canvas
   *
   * @param {array} ...
   */
  draw: function(bits) {
    for (var x = 0; x < Panel.COLS; x++) {
      for (var y = 0; y < Panel.ROWS; y++) {
        Panel.Canvas.draw_pixel({ x: x, y: y }, !!bits[x * Panel.ROWS + y]);
      }
    }
  },

};

var publish_lock = 0;

/**
 * ...
 */
Panel.Remote = {
  acquire: function() {
    console.log("Panel.Remote.acquire(): Requesting remote display current data");

    $.post("?a=acquire", function(response) {
      console.log("Received remote data, updating canvas");

      var data = response;
      console.log("got data");

      var bits = Panel.Data.unpack(data);
      Panel.Canvas.draw(bits);
    });
  },

  publish: function() {
    if (publish_lock) {
      console.log("Panel.Remote.publish(): Publishing lock, waiting");
      return;
    }
    console.log("Panel.Remote.publish(): Sending panel data for publication");
    publish_lock = 1;

    // acquire the data
    var data = Panel.Data.pack(Panel.Canvas.acquire());
    $.post("?a=publish", { "d": data }, function() {
      console.log("DONE");
      publish_lock = 0;
    }).fail(function(err) {
      console.log("FAIL", err);
      alert('Failed: ' + err.responseText);
      publish_lock = 0;
    });
  },

  renderText: function(text, callback) {
    console.log("Panel.Remote.renderText(): Sending text data for renderization");

    $.post("?a=render", { "t": text }, function(response) {
      console.log("Got render data = " + response);
      callback(response);
    }, "text");
  }
};

$(function() {
  Panel.element = document.getElementById("flip");
  Panel.ctx = Panel.element.getContext("2d");

  Panel.ctx.imageSmoothingEnabled = false;

  Panel.CanvasPreview.element = document.getElementById("preview");

  var _getCoordsFromMouseEvent = function(e) {
    // we use the offsetX/Y as they are the most accurate
    var dom_x = e.offsetX;
    var dom_y = e.offsetY;

    // we then need to factor-down to the virtual pixel
    var factor_x = Panel.element.clientWidth / Panel.COLS;
    var factor_y = Panel.element.clientHeight / Panel.ROWS;

    var virt_x = Math.floor(dom_x / factor_x);
    var virt_y = Math.floor(dom_y / factor_y);

    return { x: virt_x, y: virt_y };
  };


  Panel.element.onmousedown = function(e) {
    // console.log("down ", e);
    // console.log(".. e.button: ", e.button);
    // console.log(".. e.buttons: ", e.buttons);
    // console.log(".. e.client[XY]: ", e.clientX, e.clientY);
    // console.log(".. e.layer[XY]: ", e.layerX, e.layerY);
    // console.log(".. e.movement[XY]: ", e.movementX, e.movementY);
    // console.log(".. e.offset[XY]: ", e.offsetX, e.offsetY);
    // console.log(".. e.page[XY]: ", e.pageX, e.pageY);
    // console.log(".. e.[XY]: ", e.x, e.y);

    // var factor_x = Panel.element.clientWidth / Panel.COLS;
    // var factor_y = Panel.element.clientHeight / Panel.ROWS;
    // var virt_x = Math.floor(e.offsetX / factor_x);
    // var virt_y = Math.floor(e.offsetY / factor_y);

    // console.log("conversion");
    // console.log(".. client[WH]: ", Panel.element.clientWidth, Panel.element.clientHeight);
    // console.log(".. factor[XY]: ", factor_x, factor_y);
    // console.log(".. virt[XY]: ", virt_x, virt_y);

    if (!(e.buttons & 0x3))
      return;

    var coords = _getCoordsFromMouseEvent(e);

    Panel.Canvas.draw_pixel(coords, (e.buttons != 0x02));

    return false;
  };

  Panel.element.onmousemove = function(e) {
    if (!(e.buttons & 0x3))
      return;

    var coords = _getCoordsFromMouseEvent(e);

    Panel.Canvas.draw_pixel(coords, (e.buttons != 0x02));
    // console.log(".. button: ", e.button);
    // console.log(".. buttons: ", e.buttons);
    // if (!mouse_drawing)
      // return;
    // console.log("moving ", e);

    return false;
  };

  Panel.element.onmouseup = function(e) {
    // console.log("up ", e);
    return false;
  };

  Panel.element.oncontextmenu = function(e) {
    e.preventDefault();
  };

  // draw_pixel(1, 1, true);
  // draw_pixel(3, 3, false);
  Panel.Canvas.clear();
});
