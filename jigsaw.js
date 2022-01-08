let transparent_image, imgurl, ctx;
let rows,
  cols,
  pieces,
  pieceWidth,
  pieceHeight,
  selectCount = 0;
let currlevel;

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  modal.style.display = "none";
};

// when modal is open and we click anywhere outside the modal, this function will close the Modal.
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//stores the arrangement of pieces in real time
const arrangements = {
  level1: {
    rows: 1,
    cols: 2,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
    ],
  },
  level2: {
    rows: 1,
    cols: 3,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
    ],
  },
  level3: {
    rows: 2,
    cols: 5,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 3, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
      { col: 4, row: 1 },
    ],
  },
};
// stores the original arrangement of pieces to compare to, to know that Jigsaw puzzle has been completed
let originalArrangement = {
  level1: {
    rows: 1,
    cols: 2,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
    ],
  },
  level2: {
    rows: 1,
    cols: 3,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
    ],
  },
  level3: {
    rows: 2,
    cols: 5,
    pieces: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 3, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 3, row: 1 },
      { col: 4, row: 1 },
    ],
  },
};

//on click function of level buttons i.e. decide how many pieces would the image be divided in
function onButtonClick(x) {
  let level = `level${x}`;

  currlevel = level;
  rows = arrangements[level].rows;
  cols = arrangements[level].cols;
  pieces = arrangements[level].pieces;
  document.getElementById("userimg").className = "show";
  document.getElementById("labelimg").className = "show";
}

//shuffle the divided pieces of the image
function shuffle(a) {
  for (let j, x, i = a.length; i; ) {
    j = Math.floor(Math.random() * i);
    (x = a[--i]), (a[i] = a[j]), (a[j] = x);
  }
  return a;
}

//draws the image on the canvas, this function is used after swapping, after shuffling and so on.
function draw() {
  let puzzlemap = document.getElementById("puzzlemap");
  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = pieces[i];
      ctx.drawImage(
        transparent_image,
        p.col * pieceWidth,
        p.row * pieceHeight,
        pieceWidth,
        pieceHeight,
        x * pieceWidth,
        y * pieceHeight,
        pieceWidth,
        pieceHeight
      );

      let area = document.createElement("area");
      area.shape = "rect";
      area.coords = `${x * pieceWidth},${y * pieceHeight},${
        (x + 1) * pieceWidth
      },${(y + 1) * pieceHeight}`;
      area.href = `javascript:highlight(${x},${y},${i})`;
      // area.setAttribute("loc",`${x},${y}`);
      area.setAttribute("pieceno", `${i}`);
      area.setAttribute("xcoord", `${x}`);
      area.setAttribute("ycoord", `${y}`);
      area.setAttribute("select", "false");
      puzzlemap.appendChild(area);
      i++;
    }
  }
  transparent_image.setAttribute("usemap", "#puzzlemap");
}

//comparator function to check if the current arrangement of the pieces corresponds to solve jigsaw or not.
var isEqual = function (value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  var otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function (item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

//highlight the two pieces which are selected.
function highlight(x, y, i) {
  let area = document.querySelector(`area[xcoord="${x}"][ycoord="${y}"]`);

  if (area.getAttribute("select") === "false") {
    selectCount++;
    console.log(selectCount);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);
    area.setAttribute("select", "true");
  } else {
    selectCount--;
    let p = pieces[i];
    ctx.clearRect(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);

    ctx.drawImage(
      transparent_image,
      p.col * pieceWidth,
      p.row * pieceHeight,
      pieceWidth,
      pieceHeight,
      x * pieceWidth,
      y * pieceHeight,
      pieceWidth,
      pieceHeight
    );
    area.setAttribute("select", "false");
  }
  swap();
  if (isEqual(originalArrangement[currlevel].pieces, pieces)) {
    console.log("same members");
    modal.style.display = "block";
  } else {
    console.log("keep playing");
  }
}

//swap the two pieces selected
function swap() {
  if (selectCount == 2) {
    const se = document.querySelectorAll('area[select="true"]');
    let firstPieceNo = parseInt(se[0].getAttribute("pieceno"));
    let secondPieceNo = parseInt(se[1].getAttribute("pieceno"));

    //select the two images clicked
    se[0].href = `javascript:highlight(${se[0].getAttribute(
      "xcoord"
    )},${se[0].getAttribute("ycoord")},${secondPieceNo})`;
    se[1].href = `javascript:highlight(${se[1].getAttribute(
      "xcoord"
    )},${se[1].getAttribute("ycoord")},${firstPieceNo})`;

    se[0].setAttribute("select", "false");
    se[1].setAttribute("select", "false");

    console.log({ firstPieceNo, secondPieceNo });

    // swap the two pieces which are selected
    let temp = pieces[firstPieceNo];
    pieces[firstPieceNo] = pieces[secondPieceNo];
    pieces[secondPieceNo] = temp;

    console.log(pieces);
    console.log(originalArrangement[currlevel].pieces);

    //re initialise the count of selected pieces to 0
    selectCount = 0;

    draw();
  }
}

//this function is called just after we get the image to draw the canvas, know its height, width,
// shuffle the pieces for the first time and if the shuffled arrangement is the solved optimal, tell
// the user that the Jigsaw puzzle is complete.
function start() {
  document.getElementById("container").appendChild(transparent_image);
  let canvas = document.getElementById("canvas");
  canvas.width = transparent_image.width;
  canvas.height = transparent_image.height;
  ctx = canvas.getContext("2d");
  pieceWidth = canvas.width / cols;
  pieceHeight = canvas.height / rows;
  shuffle(pieces);
  if (isEqual(originalArrangement[currlevel].pieces, pieces)) {
    console.log("same members");

    modal.style.display = "block";
  } else {
    console.log("keep playing");
  }
  document.getElementById("userimg").className = "hide";
  document.getElementById("labelimg").className = "hide";
  console.log(pieces);
  draw();
}

//input image button event listener to get the image src and use it to create the image on canvas
// also determine the flex coloumn based on the width of the image.
document.getElementById("userimg").addEventListener("change", (event) => {
  imgurl = window.URL.createObjectURL(
    document.getElementById("userimg").files[0]
  );
  transparent_image = new Image();
  transparent_image.classList.add("stack");
  transparent_image.id = "transparent";
  transparent_image.onload = start;
  transparent_image.src = imgurl;
  const newImg = document.createElement("img");
  newImg.onload = () => {
    console.log("Image Size", newImg.width, newImg.height);
    if (newImg.width > 600) {
      console.log("hi");
      document.getElementById("gallery").classList.remove("main");
      document.getElementById("gallery").classList.add("other");
    }
  };
  newImg.src = imgurl;
  document.getElementById("append").appendChild(newImg);
});
