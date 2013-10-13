require("../spec-setup");

(function($, undefined){
	"use strict";

	initializePlugin();
	var ListingFactory = getClass("ListingFactory");

	var html = getHtmlFromFile("simple-fixture.html");
	var listingId = "source-code";

	describe("ListingFactory", function() {

		it("creates a code listing", function() {
			setFixtures(html);
			var factory = new ListingFactory();

			var $mockListing = { outerHeight: jasmine.createSpy("outerHeight") };
			spyOn(factory, "selectElement").andReturn($mockListing);

			var listing = factory.create(listingId);
			expect(factory.selectElement).toHaveBeenCalled();

			listing.height();
			expect($mockListing.outerHeight).toHaveBeenCalled();
		});

		it("selects the DOM element specified", function() {
			setFixtures(html);
			var factory = new ListingFactory();

			var $listing = factory.selectElement(listingId);
			expect($listing).toBe("#" + listingId);
		});

	});
})(jQuery);
