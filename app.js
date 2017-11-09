var app = require('express')();
var excel = require('xlsx');

//fisher-yates
function shuffle(array, size){
  for(var i = 0; i < size; i++){
    var j = Math.floor((Math.random() * (size-i)) + i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//due to this being guac specific, some calls will be very specific to this case
//this code, if used elsewhere, would not work as well as it would
//i.e. selecting within range + level would require sql type call
//unless organized very well

//yes, this is framework for the 'master' random song generator that will come later
//but for now, i have deadline

//personal note: heroku has 10k limit for each postgres database, but i dont think
//there's a limit on how much i can make

//if i really want to host this for FREE, i need to get through some loopholes
//if this was purely json data and pulling data from it, i can use randomizer with ease
//todo later: make mental note somewhere else

function grab_data(worksheet, row){
  var songname = worksheet[("A" + row)].v;
  var artist = worksheet[("B" + row)].v;
  var level = worksheet[("C" + row)].v;
  var difficulty = worksheet[("D" + row)].v;

  var obj = {
    name: songname,
    artist: artist,
    level: level,
    difficulty: difficulty
  }
  return obj;
}

app.get('/:game/:min/:max', function(req, res, next){
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

  var total = 0;
  var offset = 0;
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  var x = 1; //due to column title "total";

  for(x; x < req.params.min; x++){
    var cell = "F"+x;
    offset += worksheet[cell].v;
  }

  for(x; x <= req.params.max; x++){
    var cell = "F"+x;
    total += worksheet[cell].v;
  }

  var random = Math.floor((Math.random() * total)) + 1 + offset;

  var return_obj = grab_data(worksheet, random);

  res.json(return_obj);
});


//won't be used for guac, but something interesting to think about, especially useful for card-draw
app.get('/:game/:min/:max/:count', function(req, res, next){
  var count = req.params.count;
  var min = req.params.min;
  var max = req.params.max;
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
  var total = 0;
  var offset = 0;
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  var x = 1; //due to column title "total";
  for(x; x < req.params.min; x++){
    var cell = "F"+x;
    offset += worksheet[cell].v;
  }
  for(x; x <= req.params.max; x++){
    var cell = "F"+x;
    total += worksheet[cell].v;
  }

  var array = [];
  for(var i = 1;  i <= total; i++){
    array.push(i);
  }
  array = shuffle(array, total);

  var return_obj = {
    songs: []
  }
  for(var i = 0; i < count; i++){
    var obj = grab_data(worksheet, (array[i]+offset));
    return_obj.songs.push(obj);
  }
  console.log(return_obj.songs);
  console.log(count);
  res.json(return_obj);

});


const port = process.env.PORT || 3001;

app.listen(port);
