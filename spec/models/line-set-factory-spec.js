require("../spec-setup");

(function($, undefined){
	"use strict";

	initializePlugin();
	var LineSetFactory = getClass("LineSetFactory");

	var html = getHtmlFromFile("simple-fixture.html");

	var lineNumbers = "1,3,5-7";
	var lineNumbersArray = [ 1, 3, 5, 6, 7 ];

	var lineNumberParser = {
		parse: jasmine.createSpy("lineNumberParser").andReturn(lineNumbersArray)
	};
	var lineSelector = function(fileIdentifier, lineNumber) {
		return "#" + fileIdentifier + " #line-" + lineNumber;
	};
	var highlightClass = "highlighted";

	function getLines() {
		var $result = $();
		$.each(lineNumbersArray, function(index, lineNumber) {
			$result = $result.add($("#line-" + lineNumber));
		});
		return $result;
	}

	describe("LineSetFactory", function() {

		it("creates a line set", function() {
			setFixtures(html);

			var factory = new LineSetFactory(lineNumberParser, lineSelector, highlightClass);
			spyOn(factory, "selectLines").andCallFake(getLines);

			var lineSet = factory.create("source-code", lineNumbers);
			expect(lineNumberParser.parse).toHaveBeenCalled();
			expect(factory.selectLines).toHaveBeenCalled();

			lineSet.highlight();

			$.each(lineNumbersArray, function(index, lineNumber) {
				expect($("#line-" + lineNumber)).toHaveClass(highlightClass);
			});
		});

		it("selects the appropriate DOM elements", function() {
			setFixtures(html);

			var factory = new LineSetFactory(lineNumberParser, lineSelector, highlightClass);
			var $lines = factory.selectLines("source-code", lineNumbersArray);

			expect($lines.length).toEqual(lineNumbersArray.length);

			$.each(lineNumbersArray, function(index, lineNumber) {
				expect($lines.filter("#line-" + lineNumber).length).toEqual(1);
			});
		});

	});
})(jQuery);