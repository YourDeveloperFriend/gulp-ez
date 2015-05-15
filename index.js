
var through2 = require('through2');
var generator = require('ez-generator');
var File = require('vinyl');

module.exports = function(options) {
  return through2.obj(function(file, enc, cb) {
    delete require.cache[file.path];
    var Controller = require(file.path);
    var frontendFile = new File({
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      contents: new Buffer(generator(Controller, options))
    });
    this.push(frontendFile);
    cb();
  });
}

