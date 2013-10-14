(function($, undefined) {
	"use strict";

	initializePlugin();
	var NullCallout = getClass("NullCallout");

	describe("NullCallout", function() {
		var callout = new NullCallout();

		it("should have a deactivate member", function() {
			expect(callout.deactivate).toBeDefined();
		});
	});
})(jQuery);
