jsdom = require("jsdom").jsdom();
window = jsdom.createWindow();
jQuery = require("jquery");

require("jasmine-jquery");

var targetCode = typeof process.env.TARGET_CODE_FILE !== "undefined" ?
	process.env.TARGET_CODE_FILE :
	"lib/jquery.code-callout";

console.log("Testing " + targetCode);
require("../" + targetCode);

initializePlugin = function() {
	jQuery().codeCallout({ exposeForTest: true });
};

getClass = function(name) {
	return window.__codeCallout[name];
};

getHtmlFromFile = function(filename) {
	var fixtureFilePath = require("path").resolve(__dirname + "/fixtures", filename);
	return require("fs").readFileSync(fixtureFilePath, "utf-8");
};
