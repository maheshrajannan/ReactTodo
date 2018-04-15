var cors = require('cors');
var fs = require('fs');

var whitelist = ['https://localhost:3000','https://localhost:4000'];

var corsOptions = {
  origin: function(origin, callback){
    console.log("checking if this is whitelisted "+origin);
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    console.log("checked if this is whitelisted "+originIsWhitelisted);
    callback(null, originIsWhitelisted);
  }
};


module.exports.corsOptions = corsOptions;
