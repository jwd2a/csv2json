var fs = require('fs');
var parse = require('babyparse');

var pcf = {};
var parents = [];

var dir = process.argv[2];

fs.readdir(dir, function(err, files) {
  files.forEach(function(filename) {
    console.log(filename);
    fs.readFile(dir + "/" + filename, 'utf-8', function(err, f) {
      console.log(f);
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

            if (i == 1) {
              pcf.items.push(element);
            } else {
              parents[i - 1].children.push(element);
            }

          }
        });
      });
      fs.writeFile(filename.split(".")[0]+".json", JSON.stringify(pcf));
    });
  });
});
