function handler(vars) {
    console.log('Entered my cool script!');
}

module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
    module_holder['test'] = handler;
};