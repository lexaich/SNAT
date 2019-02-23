var express = require('express');
var app = express();

app.use(express.json());

app.post('/api', function(req, res){
  console.log(req.body)
  var keys = Object.keys(req.body)
  var responseJSON = {}
  keys.map((key) => {
    responseJSON[key] = Math.random()
  })
  res.json(responseJSON);
});

app.listen(5000);