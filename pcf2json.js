var fs = require('fs');
var parse = require('babyparse');

var pcf = {
  sections: []
};
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
          section = {
            section_num: filename.split(".")[0] + ".0",
            title: line[1],
            children: []
          };
        }

        line.forEach(function(data, i) {
          if (i != 0 && data) {

            var element = {
              "elementID": line[0],
              "title": data,
              "children": []
            }

            parents[i] = element;

            if (i == 1) {
              section.children.push(element);
            } else {
              parents[i - 1].children.push(element);
            }
          }
        });
      });
      pcf.sections.push(section);
      console.log(section);
    }
  });
  fs.writeFile("framework.json", JSON.stringify(pcf));
});
