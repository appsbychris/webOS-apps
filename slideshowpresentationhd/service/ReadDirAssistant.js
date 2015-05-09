var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
var fs = IMPORTS.require("fs");

var path = this.controller.args.path;

fs.readdir(path, function(err, files) {
	var s = ""
		var c = 0
		var t = ""
	for (var i = 0;i<files.length;i++) {
		
			if (fs.statSync(path + files[i]).isDirectory()) {
				s = s + files[i] + "|"
			}
			else { 
				c++
				t = t + files[i] + "|"
			}
	}
	future.result = c.toString() + "|" + s + "}|{" + t; });
}