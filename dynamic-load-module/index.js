var modules = require("./load_module.js");


try {
    modules[process.argv[2]](process.argv.slice(3));
} catch(e) {
    console.log("e");
}