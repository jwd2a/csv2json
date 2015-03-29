var fs = require('fs');
var parse = require('babyparse');

var pcf = [];
var parents = [];
var section;

var dir = process.argv[2];

fs.readdir(dir, function(err, files) {
  files.forEach(function(filename) {
    //only process CSVs
    if (filename.split(".")[2] == "csv") {
      console.log("PROCESSING " + filename + ".......");
      var f = fs.readFileSync(dir + "/" + filename, 'utf-8');
      var obj = parse.parse(f);
      obj.data.forEach(function(line, lineNum) {

        if (lineNum === 0) {
          pcf.push({
            section_num: filename.split(".")[0] + ".0",
            title: line[1],
            children: []
          });
        }

        line.forEach(function(data, i) {
          if (i != 0 && data) {
            var element = {
              "elementID": line[0],
              "children": []
            }

            var title = data.split(" ");

            element.depth = calcDepth(title[0]);

            title.splice(0,1);
            title.splice(title.length - 1, 1);
            element.title = title.join(" ");

            parents[i] = element;

            if (i == 1) {
              pcf[lineNum].children.push(element);
            } else {
              parents[i - 1].children.push(element);
            }
          }
        });
      });
    }
  });
  fs.writeFile("framework.json", JSON.stringify(pcf));
});

function calcDepth(title){

  if(title.split(".")[1] == 0){
    return 1;
  }
  if(title.split(".").length == 2){
    return 2;
  }
  if(title.split(".").length == 3){
    return 3;
  }
  if(title.split(".").length == 4){
    return 4;
  }
}
