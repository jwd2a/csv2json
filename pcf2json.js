var fs = require('fs');
var parse = require('babyparse');

var pcf = {};
var currentLevel = 0;
var previousLevel = 0;
var parents = [];

fs.readFile('data.csv', 'utf-8', function(err, f) {
  var obj = parse.parse(f);
  obj.data.forEach(function(line, lineNum) {

    if (lineNum === 0) {
      pcf.framework = line[1];
      pcf.items = [];
    }

    line.forEach(function(data, i) {
      if (i != 0 && data) {

        var element = {
          "elementID": line[0],
          "element": data,
          "children": []
        }

        parents[i] = element;

        if(i == 1){
          pcf.items.push(element);
        } else {
          parents[i - 1].children.push(element);
        }

      }
    });
  });
  console.log(JSON.stringify(pcf, null, 2));
});
