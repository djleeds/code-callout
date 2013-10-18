require("../spec-setup");

(function($, undefined){
	"use strict";

	initializePlugin();
	var NoteFactory = getClass("NoteFactory");

	var noteText = "This is a callout note";
	var buttonText = "Close this callout note";
	var positionAdvice = jasmine.createSpy("positionAdvice");

	var noteId = "note";
	var contentClass = "content";
	var buttonClass = "close";

	var factory = new NoteFactory(noteId, contentClass, buttonText, buttonClass);

	describe("NoteFactory", function() {

		it("renders contents", function() {
			var $content = factory.renderContent(noteText);
			expect($content).toBe("div." + contentClass);
			expect($content).toHaveText(noteText);
		});

		it("renders a close button", function() {
			var $button = factory.renderCloseButton();
			expect($button).toBe("button." + buttonClass);
			expect($button).toHaveText(buttonText);
		});

		it("renders a note", function() {
			var $note = factory.render(noteText);
			expect($note).toBe("div#" + noteId);
			expect($note).toContainText(noteText);
			expect($note).toContainText(buttonText);
		});

		it("creates a note", function() {
			var note = factory.create(noteText, positionAdvice);
			note.attach();
			note.show();

			var $note = $("body #" + noteId);
			expect($note).toExist();
			expect($note).toContainText(noteText);
			expect($note).toContainText(buttonText);
		});

	});

})(jQuery);