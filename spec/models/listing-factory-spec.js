(function($, undefined){
	"use strict";

	initializePlugin();
	var ListingFactory = getClass("ListingFactory");

	var listingId = "source-code";

	describe("ListingFactory", function() {

		beforeEach(function() {
			loadFixtures("simple-fixture.html");
		});

		it("creates a code listing", function() {
			var factory = new ListingFactory();

			var $mockListing = { outerHeight: jasmine.createSpy("outerHeight") };
			spyOn(factory, "selectElement").and.returnValue($mockListing);

			var listing = factory.create(listingId);
			expect(factory.selectElement).toHaveBeenCalled();

			listing.height();
			expect($mockListing.outerHeight).toHaveBeenCalled();
		});

		it("selects the DOM element specified", function() {
			var factory = new ListingFactory();

			var $listing = factory.selectElement(listingId);
			expect($listing).toBeMatchedBy("#" + listingId);
		});

	});
})(jQuery);
