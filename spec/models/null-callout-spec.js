require("../spec-setup");

(function($, undefined) {
	"use strict";

	initializePlugin();
	var NullCallout = getClass("NullCallout");

	describe("NullCallout", function() {
		var callout = new NullCallout();
		expect(callout.deactivate).toBeDefined();
	});
})(jQuery);