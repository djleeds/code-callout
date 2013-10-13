require("../spec-setup");

(function($, undefined){
	"use strict";

	initializePlugin();
	var CalloutFactory = getClass("CalloutFactory");

	var note = jasmine.createSpyObj("note", ["activate", "bottom", "onClose"]);
	var lineSet = jasmine.createSpyObj("lineSet", ["highlight", "top", "bottom", "left", "lineHeight"]);
	var listing = jasmine.createSpyObj("listing", ["center", "height", "bottom"]);

	var noteFactory = { create: jasmine.createSpy("noteFactory.create").andReturn(note) };
	var listingFactory = { create: jasmine.createSpy("listingFactory.create").andReturn(listing) };
	var lineSetFactory = { create: jasmine.createSpy("lineSetFactory.create").andReturn(lineSet) };

	var scroller = jasmine.createSpyObj("scroller", ["to"]);
	var noteOffsetFromLine = 1.25;
	var readingPosition = 350;

	var factory = new CalloutFactory(noteFactory, listingFactory, lineSetFactory, scroller, noteOffsetFromLine);

	var listingId = "file1";
	var lineNumbers = "1";
	var noteContents = "This is my note";
	var buttonText = "Close me";

	describe("CalloutFactory", function() {

		it("creates a callout", function() {
			var callout = factory.create({
				listingId: listingId,
				lineNumbers: lineNumbers,
				noteContents: noteContents
			}, readingPosition);

			expect(noteFactory.create).toHaveBeenCalled();
			expect(listingFactory.create).toHaveBeenCalled();
			expect(lineSetFactory.create).toHaveBeenCalledWith(listingId, lineNumbers);

			callout.activate();

			expect(note.activate).toHaveBeenCalled();
			expect(lineSet.highlight).toHaveBeenCalled();
			expect(scroller.to).toHaveBeenCalled();
		});

		it("creates position advice", function() {
			lineSet.bottom.andReturn(50);
			lineSet.left.andReturn(15);
			lineSet.lineHeight.andReturn(10);

			var advice = factory.createPositionAdvice(lineSet);
			var expectedOffset = noteOffsetFromLine * lineSet.lineHeight();

			expect(advice()).toEqual({
				top: lineSet.bottom() + expectedOffset,
				left: 15
			});
		});

	});
})(jQuery);
