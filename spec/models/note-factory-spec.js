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
			expect($content).toBeMatchedBy("div." + contentClass);
			expect($content.text()).toEqual(noteText);
		});

		it("renders a close button", function() {
			var $button = factory.renderCloseButton();
			expect($button).toBeMatchedBy("button." + buttonClass);
			expect($button.text()).toEqual(buttonText);
		});

		it("renders a note", function() {
			var $note = factory.render(noteText);
			expect($note).toBeMatchedBy("div#" + noteId);
			expect($note.text()).toMatch(noteText);
			expect($note.text()).toMatch(buttonText);
		});

		it("creates a note", function() {
			var note = factory.create(noteText, positionAdvice);
			note.attach();
			note.show();

			var $note = $("body #" + noteId);
			expect($note).toExist();
			expect($note.text()).toMatch(noteText);
			expect($note.text()).toMatch(buttonText);
		});

	});

})(jQuery);