(function($, undefined) {
	"use strict";

	initializePlugin();
	var LineNumberParser = getClass("LineNumberParser");

	var parser = new LineNumberParser();

	describe("LineNumberParser", function() {

		describe("#isLineRange", function() {

			it("returns true for range strings", function() {
				expect(parser.isLineRange("1-3")).toBeTruthy();
			});

			it("returns false for a single number", function() {
				expect(parser.isLineRange("5")).toBeFalsy();
			});

		});

		describe("#parseLineRange", function() {

			it("parses a line range into an array of line numbers", function() {
				var actual = parser.parseLineRange("1-5");

				expect(actual).not.toContain(0);

				expect(actual).toContain(1);
				expect(actual).toContain(2);
				expect(actual).toContain(3);
				expect(actual).toContain(4);
				expect(actual).toContain(5);

				expect(actual).not.toContain(6);
			});

		});

		describe("#parse", function() {

			it("handles single line numbers", function() {
				var actual = parser.parse("5");
				expect(actual.length).toEqual(1);
				expect(actual).toContain(5);
			});

			it("handles a comma-separated list of line numbers", function() {
				var actual = parser.parse("2,4");
				expect(actual.length).toEqual(2);
				expect(actual).toContain(2);
				expect(actual).toContain(4);
			});

			it("handles a range of line numbers", function() {
				var actual = parser.parse("3-5");
				expect(actual.length).toEqual(3);
				expect(actual).toContain(3);
				expect(actual).toContain(4);
				expect(actual).toContain(5);
			});

			it("handles a combination of comma-separated and ranges", function() {
				var actual = parser.parse("1,3-5,7");
				expect(actual.length).toEqual(5);
				expect(actual).toContain(1);
				expect(actual).toContain(3);
				expect(actual).toContain(4);
				expect(actual).toContain(5);
				expect(actual).toContain(7);
			});

		});
	});
})(jQuery);
