var fs = require('fs');
var path_API = require('path');
var modules = {};

function LoadModules(path) {
    try {
        var stat = fs.lstatSync(path);
        if (stat.isDirectory()) {
            var files = fs.readdirSync(path), f;
            for (var i = 0; i < files.length; i++) {
                f = path_API.join(path, files[i]);
                LoadModules(f);
            }
        } else {
            // load a new module
            require(path)(modules);
        }
    } catch(e) {
        // error when load Module
        //console.log(e);
    }
}


var DIR = path_API.join(__dirname, 'API');
LoadModules(DIR);

module.exports = modules;