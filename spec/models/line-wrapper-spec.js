(function($, undefined) {
	"use strict";

	initializePlugin();
	var LineWrapper = getClass("LineWrapper");

	var lineClass = "code-callout-line";
	var numberClassPrefix = "number-";
	var defaultFilter = function($listing) { return $listing; };
	var beforeWrap = function() {};

	function createWrapper($listing, filter) {
		if(typeof(filter)==="undefined") filter = defaultFilter;
		return new LineWrapper($listing, lineClass, numberClassPrefix, filter, beforeWrap);
	}

	describe("LineWrapper", function() {
		it("knows when it's already wrapped", function() {
			var $wrappedListing = $("<div />").html('<div class="code-callout-line" />');
			var wrapper = createWrapper($wrappedListing);
			expect(wrapper.isAlreadyWrapped()).toBeTruthy();
		});

		it("knows when it's not already wrapped", function() {
			var wrapper = createWrapper($("<div />"));
			expect(wrapper.isAlreadyWrapped()).toBeFalsy();
		});

		it("wraps a line", function() {
			var wrapper = createWrapper($("<div />"));
			var lineNumber = 2;
			var $line = wrapper.wrapLine(lineNumber, "this is a line");
			expect($line).toBeMatchedBy("div." + lineClass + "." + numberClassPrefix + (lineNumber+1));
		});

		it("splits a listing into lines", function() {
			var wrapper = createWrapper($("<div />").text("one\ntwo\nthree"));
			var lines = wrapper.splitIntoLines();

			expect(lines.length).toEqual(3);
		});

		it("splits a listing into lines with a filter", function() {
			var lineHtml = '<ol><li>one</li>\n<li>two</li></ol><div id="other-junk" />';
			var filter = function($listing) { return $listing.not("#other-junk"); };
			var wrapper = createWrapper($(lineHtml), filter);

			var lines = wrapper.splitIntoLines();
			expect($(lines)).not.toContainElement("#other-junk");
		});

		it("replaces the contents of a listing", function() {
			var oldHtml = '<div><span></span></div>';
			var newHtml = '<ol><li>item</li></ol>';
			var $listing = $(oldHtml);
			var wrapper = createWrapper($listing);
			wrapper.replaceListing($(newHtml));
			expect($listing).toContainHtml("<li>item</li>");
		});

		it("wraps a listing", function() {
			var $listing = $('<div>one\ntwo\nthree</div>');
			var wrapper = createWrapper($listing);

			wrapper.wrapListing();

			var lines = [ "one", "two", "three" ];
			for(var i = 0; i < lines.length; i++) {
				expect($listing).toContainElement("." + lineClass + "." + numberClassPrefix + (i + 1));
			}

		});
	});
})(jQuery);
