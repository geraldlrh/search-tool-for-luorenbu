var fs = require('fs');
var path = require('path');
var glob = require('glob');
var prompt = require('prompt');

//config
var headParttern = /\s+Dose\s+\[cGy\]\s+Relative\s+dose\s+\[%\]\s+/;

var log = console.log;
// input
var globPattern = 'in/+([^.])';
var colum = null;
var sortType = null;  //ascend descend
var num = null;
// output
var resultArr = [];
// var detailArr = [];

// prompt
prompt.message = "请依次输入（需处理那组文件的的第一个文件名），（查找第几列），（查找的值）：".green;

var schema = {
  properties: {
    fileName: {
      pattern: /^1(.)?(\d)?$/,
      message: '文件名以1开头，如：1.2',
      required: true
    },
    colum: {
      pattern: /(1|3)/,
      message: '只能为1或3',
      default: '1',
      required: true
    },
    num: {
      pattern: /^\d*(.)?\d*$/,
      message: '请输入正确的浮点数',
      required: true
    }
  }
};

prompt.start();

prompt.get(schema, function(err, result) {
  var dotIndex = result.fileName.indexOf('.');
  if (dotIndex !== -1) {
    globPattern += '@(' + result.fileName.slice(dotIndex) + ')';
  }

  colum = result.colum - 1;
  sortType = colum === 0 ? 'ascend' : 'descend'; 

  num = parseFloat(result.num);

  searchFile();
});

// begin
function searchFile() {
  glob(globPattern, function(error, files) {
    if (error) {
      throw error;
    }

    files.forEach(function(filePath) {
      processSingleFile(filePath);
      resultArr.push('');
    });

    end();
  });
}

function processSingleFile(filePath) {
  var fileName = filePath.split(path.sep).pop();
  log('fileName:'+fileName);

  var fileData = fs.readFileSync(filePath);
  var string = fileData.toString();
  var dataArr = [];
  // var lineArr = string.split(/\n+/i);
  var lineArr = string.split(/[\n\r]+/i);
  var lineTemp = null;
  var lineDataArrTemp = null;
  var hasBegin = false;

  for (var i = 0; i < lineArr.length; i++) {
    var line = lineArr[i];
    if (line.search(headParttern) !== -1) {
      hasBegin = true;
      continue;
    }
    if(hasBegin) {
      var lineDataArr = line.split(/(\s+)/);
      lineDataArr = transfer(lineDataArr);
      if (colum >= 0 && colum < lineDataArr.length) {
        if (sortType === 'ascend') {
          if (num > parseFloat(lineDataArr[colum]).toFixed(10)) {
            lineTemp = line;
            lineDataArrTemp = lineDataArr;
          }
          else {
            if (lineDataArrTemp === null) {
              break;
            }
            if ((lineDataArr[colum] - num).toFixed(10) == (num - lineDataArrTemp[colum]).toFixed(10)) {
              log(lineTemp);
              log(line);
              resultArr.push(lineTemp);
              resultArr.push(line);
              break;
            }
            else if ((lineDataArr[colum] - num).toFixed(10) > (num - lineDataArrTemp[colum]).toFixed(10)) {
              log(lineTemp);
              resultArr.push(lineTemp);
              break;
            }
            else {
              log(line);
              resultArr.push(line);
              break;
            }
          }
        }
        else {
          if (num < parseFloat(lineDataArr[colum]).toFixed(10)) {
            lineTemp = line;
            lineDataArrTemp = lineDataArr;
          }
          else {
            if (lineDataArrTemp === null) {
              break;
            }
            if ((lineDataArr[colum] - num).toFixed(10) == (num - lineDataArrTemp[colum]).toFixed(10)) {
              log(lineTemp);
              log(line);
              resultArr.push(lineTemp);
              resultArr.push(line);
              break;
            }
            else if ((lineDataArr[colum] - num).toFixed(10) < (num - lineDataArrTemp[colum]).toFixed(10)) {
              log(lineTemp);
              resultArr.push(lineTemp);
              break;
            }
            else {
              log(line);
              resultArr.push(line);
              break;
            }
          }
        }
      }
      else if (lineDataArr.length) {
        throw '数组越界，请检查输入';
      }
    }
  }
}

function transfer(lineDataArr) {
  var result = [];

  for (var i = 0; i < lineDataArr.length; i++) {
    var item = lineDataArr[i];
    if (item.trim() !== '') {
      item = item.trim();
      var eIndex = item.indexOf('e');
      if (eIndex !== -1) {
        item = item.slice(0, eIndex - 1) * Math.pow(10, item.slice(eIndex + 1));
      }
      result.push(item);
    }
  }

  return result;
}

// end
function end() {
  var buff = new Buffer(resultArr.join('\n'));
  fs.writeFile("out.txt", buff, function (error) {
      if (error) {
          throw error;
      }
      console.log('complete.');
      process.exit(0);
  });
}

 