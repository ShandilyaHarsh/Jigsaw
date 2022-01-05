// var origImag;

// var loadFile = function (event) {
//   var image = document.getElementById("output");
//   image.src = URL.createObjectURL(event.target.files[0]);
//   origImag = URL.createObjectURL(event.target.files[0]);
// };

document.getElementById("userimg").addEventListener("change", (event) => {
  console.log("Event Detected");
  const imgfile = document.getElementById("userimg").files[0];
  const imgurl = window.URL.createObjectURL(imgfile);

  console.log("PATH: " + imgurl);
  let myimg = new Image();
  myimg.addEventListener("load", (event) => {
    document.getElementById("canvas").width = myimg.width;
    document.getElementById("canvas").height = myimg.height;
    start(myimg);
  });
  myimg.src = imgurl;
});

function start(img) {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let cw = canvas.width;
  let ch = canvas.height;
  // let rows=5;
  // let cols=5;
  let rows = 1;
  let cols = 2;
  let iw = (canvas.width = img.width);
  let ih = (canvas.height = img.height);
  let pieceWidth = iw / cols;
  let pieceHeight = ih / rows;

  let pieces = [
    { col: 1, row: 0 },
    { col: 0, row: 0 },
  ];

  // let pieces = [
  // 	{col:0,row:0},
  // 	{col:1,row:0},
  // 	{col:2,row:0},
  // 	{col:3,row:0},
  // 	{col:4,row:0},
  // 	{col:0,row:1},
  // 	{col:1,row:1},
  // 	{col:2,row:1},
  // 	{col:3,row:1},
  // 	{col:4,row:1},
  // 	{col:0,row:2},
  // 	{col:1,row:2},
  // 	{col:2,row:2},
  // 	{col:3,row:2},
  // 	{col:4,row:2},
  // 	{col:0,row:3},
  // 	{col:1,row:3},
  // 	{col:2,row:3},
  // 	{col:3,row:3},
  // 	{col:4,row:3},
  // 	{col:0,row:4},
  // 	{col:1,row:4},
  // 	{col:2,row:4},
  // 	{col:3,row:4},
  // 	{col:4,row:4},
  // ];
  // shuffle(pieces);

  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let p = pieces[i++];
      ctx.drawImage(
        img,
        x * pieceWidth,
        y * pieceHeight,
        pieceWidth,
        pieceHeight,
        p.col * pieceWidth,
        p.row * pieceHeight,
        pieceWidth,
        pieceHeight
      );
    }
  }
}

function shuffle(a) {
  for (
    let j, x, i = a.length;
    i;
    j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x
  );
  return a;
}
