var app = require('express')();
var excel = require('xlsx');

function shuffle(array, size){
  for(var i = 0; i < size; i++){
    var j = Math.floor((Math.random() * (size-i)) + i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


app.get('/quals/:game', function(req, res, next){
  var name = req.params.game;
  var filename = "guac_" + name + ".xlsx";

  try{
    var workbook = excel.readFile(filename);
  }
  catch(err){
    console.log("File not found for game " + name);
    res.status(404);
    res.end();
  }
});

//won't be used for guac, but something interesting to think about, especially useful for card-draw
app.get('/ddr/:count/:min/:max', function(req, res, next){
  var count = req.params.count;
  var min = req.params.min;
  var max = req.params.max;

  var songcount = 100;
  var array = [];
  for(var i = 1;  i <= songcount; i++){
    array.push(i);
  }
  array = shuffle(array, songcount);

  for(var i = 0; i < 100; i++){
    console.log(array[i]);
  }
});


const port = process.env.PORT || 3001;

app.listen(port);
