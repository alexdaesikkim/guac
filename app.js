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


app.get('/:game/:min/:max', function(req, res, next){
  var name = req.params.game;
  var filename = "guac_" + name + ".xlsx";

  //due to this being guac specific, some calls will be very specific to this case
  //this code, if used elsewhere, would not work as well as it would
  //i.e. selecting within range + level would require sql type call
  //unless organized very well

  //yes, this is framework for the 'master' random song generator that will come later
  //but for now, i have deadline

  //personal note: heroku has 10k limit for each postgres database, but i dont think
  //there's a limit on how much i can make

  //if i really want to host this for FREE, i need to get through some loopholes
  //todo later: make mental note somewhere else
  try{
    var workbook = excel.readFile(filename);
  }
  catch(err){0
    console.log("File not found for game " + name);
    res.status(404);
    res.end();
  }
  var total = 0;
  var offset = 0;
  var worksheet = workbook.Sheets[workbook.SheetNames[0]]
  var x = 1;
  for(x; x < req.params.min; x++){
    var cell = "E"+x;
    offset += worksheet[cell].v;
  }
  for(x; x <= req.params.max; x++){

    var cell = "E"+x;
    total += worksheet[cell].v;
  }

  var random = Math.floor((Math.random() * total)) + 1 + offset;
  console.log(random);
  var songname = worksheet[("A" + random)].v;
  var artist = worksheet[("B" + random)].v;
  var level = worksheet[("C" + random)].v;

  console.log(songname);
  console.log(artist);
  console.log(level);

  var return_obj = {
    songname: songname,
    artist: artist,
    level: level
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
