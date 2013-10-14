(function($, undefined) {
	"use strict";

	initializePlugin();
	var TriggerReader = getClass("TriggerReader");

	describe("TriggerReader", function() {

		var listingIdAttribute = "listing";
		var lineNumbersAttribute = "lines";
		var noteContentsAttribute = "note";

		beforeEach(function() {
			var $body = $("body");
			$body.html();
			$body.append("<a id='trigger' data-listing='code1' data-lines='1,3' data-note='yo' />");
		});

		it("reads a trigger", function() {
			var reader = new TriggerReader(listingIdAttribute, lineNumbersAttribute, noteContentsAttribute);
			expect(reader.read($("#trigger"))).toEqual({
				listingId: "code1",
				lineNumbers: "1,3",
				noteContents: "yo"
			});
		});

	});
})(jQuery);