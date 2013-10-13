require("../spec-setup");

(function($, undefined) {
	"use strict";

	initializePlugin();
	var Listing = getClass("Listing");

	var $code = {
		offset: jasmine.createSpy("offset").andReturn({ top: 20 }),
		outerHeight: jasmine.createSpy("outerHeight").andReturn(30)
	};

	var listing = new Listing($code);

	describe("Listing", function() {

		it("calculates its top", function() {
			expect(listing.top()).toEqual(20);
		});

		it("calculates its bottom", function() {
			expect(listing.bottom()).toEqual(50);
		});

		it("calculates its center", function() {
			expect(listing.center()).toEqual(35);
		});

		it("calculates its height", function() {
			expect(listing.height()).toEqual(30);
		});

	});

})(jQuery);