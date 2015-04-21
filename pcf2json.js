var fs = require('fs');
var Excel = require("exceljs");
var _ = require("underscore");

var pcf = [];
var parents = [];
var section;
var workbook = new Excel.Workbook();

var dir = process.argv[2];

workbook.xlsx.readFile(process.argv[2])
  .then(function() {

    var defs = [];

    var defSheet = workbook.getWorksheet("Glossary terms");
    defSheet.eachRow(function(row, rowNum) {
      if (rowNum != 1) {
        defs.push({
          elementID: row.getCell(1).value,
          definition: row.getCell(4).value
        });
      }
    });

    var sheets = [];
    //get all the sheets that correspond to a section of the PCF
    workbook.eachSheet(function(sheet) {
      if (sheet.name.split(".").length == 2) {
        sheets.push(sheet);
      }
    });

    //for each sheet, parse the lines
    var section = 0;

    sheets.forEach(function(sheet) {
      sheet.eachRow(function(row, rowNum) {

        //find definition

        var definition = _.findWhere(defs, {elementID: row.getCell(1).value});
        if(definition){
          definition = definition.definition;
        }

        if (rowNum == 2) {
          pcf.push({
            elementID: row.getCell(1).value,
            section_num: row.getCell(2).value,
            title: row.getCell(3).value,
            definition: definition,
            children: []
          });
        }

        if (rowNum > 2) {
          var element = {
            elementID: row.getCell(1).value,
            title: row.getCell(3).value,
            definition: definition,
            children: []
          }


          element.depth = calcDepth(row.getCell(2).value);

          parents[element.depth] = element;

          if (element.depth == 2) {
            pcf[section].children.push(element);
          } else {
            parents[element.depth - 1].children.push(element);
          }
        }
      });
      section++;
    });
    fs.writeFile("framework.json", JSON.stringify(pcf));
  });

function calcDepth(id) {
  return id.split(".").length;
}
