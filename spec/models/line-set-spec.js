require("../spec-setup");

(function($, undefined) {
	"use strict";

	initializePlugin();
	var LineSet = getClass("LineSet");

	describe("LineSet", function() {

		var highlightedClass, $selectedLines, lineSet;

		beforeEach(function() {
			highlightedClass = "highlighted";
			$("body").append("<ol id='source-code'></ol>");
			for(var i = 0; i < 2; i++) {
				$("#source-code").append("<li>");
			}
			$selectedLines = $("#source-code li:nth-child(2n)");
			lineSet = new LineSet($selectedLines, highlightedClass);
		});

		describe("highlighting >", function() {

			it("highlights the indicated lines", function() {
				lineSet.highlight();

				$selectedLines.each(function(index, element) {
					expect($(element)).toHaveClass(highlightedClass);
				});
			});

			it("unhighlights the indicated lines", function() {
				$selectedLines.addClass(highlightedClass);

				lineSet.unhighlight();

				$selectedLines.each(function(index, element) {
					expect($(element)).not.toHaveClass(highlightedClass);
				});
			});
		});

		describe("positioning >", function() {

			beforeEach(function() {
				$selectedLines = {
					first: jasmine.createSpy("first").andReturn({
						offset: jasmine.createSpy("offset").andReturn({
							top: 30,
							left: 10
						})
					}),
					last: jasmine.createSpy("last").andReturn({
						offset: jasmine.createSpy("offset").andReturn({
							top: 100,
							left: 10
						}),
						outerHeight: jasmine.createSpy("outerHeight").andReturn(50)
					})
				};
				lineSet = new LineSet($selectedLines, highlightedClass);
			});

			it("has a top position", function() {
				expect(lineSet.top()).toEqual(30);
			});

			it("has a bottom position", function() {
				expect(lineSet.bottom()).toEqual(150);
			});

			it("has a left position", function() {
				expect(lineSet.left()).toEqual(10);
			});

			it("has a line height", function() {
				expect(lineSet.lineHeight()).toEqual(50);
			});

		});

	});
})(jQuery);
