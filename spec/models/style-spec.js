require("../spec-setup");

(function($, undefined) {
	"use strict";

	initializePlugin();
	var Style = getClass("Style");

	var styleId = "style-id";
	var styles = {
		"a.critical": {
			"color": "red",
			"text-decoration": "underline"
		}
	};
	var expectedCSS = "a.critical{color:red;text-decoration:underline;}";

	var style = new Style(styleId, styles);

	describe("Style", function() {

		describe("#hasBeenWritten", function() {
			it("is false for an empty document", function() {
				expect(style.hasBeenWritten()).toBeFalsy();
			});

			it("is true for a document with an element having the styleId", function() {
				$("<style>").attr("id", styleId).appendTo("body");
				expect(style.hasBeenWritten()).toBeTruthy();
			});
		});

		describe("#build", function() {
			it("creates CSS using the specified styles hash", function() {
				var actual = style.build();
				expect(actual.trim()).toEqual(expectedCSS);
			});
		});

		describe("#write", function() {
			it("writes the CSS into a style tag with the specified styleId", function() {
				style.write();
				var $styleElement = $("style#" + styleId);
				expect($styleElement).toExist();
				expect($styleElement.text().trim()).toEqual(expectedCSS);
			});
		});

		describe("#initialize", function() {

			beforeEach(function() {
				$("body").html("");
			});

			it("writes the style when it hasn't yet been written", function() {
				spyOn(style, "write");
				style.initialize();
				expect(style.write).toHaveBeenCalled();
			});

			it("does not write the style when it's already been written", function() {
				style.write();
				spyOn(style, "write");
				style.initialize();
				expect(style.write).not.toHaveBeenCalled();
			});
		});

	});
})(jQuery);
