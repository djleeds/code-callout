require("../spec-setup");

(function($, undefined) {
	"use strict";

	initializePlugin();
	var Note = getClass("Note");

	describe("Note", function() {

		var note, $note, $button, positionAdvice, $window;

		beforeEach(function() {
			$("body").html("");
			$button = $("<button class='close' />");
			$note = $("<div id='note' />").append($button);
			positionAdvice = jasmine.createSpy("positionAdvice").andReturn({
				top: 50,
				left: 20
			});
			$window = {
				on: jasmine.createSpy("on"),
				off: jasmine.createSpy("off")
			};
			note = new Note($note, positionAdvice, $window);
		});

		it("attaches", function() {
			note.attach();
			expect($("body #note")).toExist();
		});

		it("detaches", function() {
			$note.appendTo("body");
			note.detach();
			expect($("body #note")).not.toExist();
		});

		it("shows", function() {
			$note.appendTo("body").hide();
			note.show();
			expect($("body #note")).toBeVisible();
		});

		it("hides", function() {
			$note.appendTo("body");
			note.hide();
			expect($("body #note")).not.toBeVisible();
		});

		it("hooks the resize event", function() {
			note.hook();
			expect($window.on).toHaveBeenCalled();
			expect($window.on.calls[0].args[0].split(".")[0]).toEqual("resize");
		});

		it("unhooks the resize event", function() {
			note.unhook();
			expect($window.off).toHaveBeenCalled();
			expect($window.off.calls[0].args[0].split(".")[0]).toEqual("resize");
		});

		it("activates", function() {
			note.activate();
			expect($("body #note")).toExist();
			expect($("body #note")).toBeVisible();
		});

		it("hooks the resize event upon activation", function() {
			note.hook = jasmine.createSpy("hook");
			note.activate();
			expect(note.hook).toHaveBeenCalled();
		});

		it("positions upon activation", function() {
			spyOn(note, "positionAt").andCallThrough();
			note.activate();
			expect(note.positionAt).toHaveBeenCalledWith({ left: 20, top: 50});
		});

		it("deactivates", function() {
			$note.appendTo("body");
			note.deactivate();
			expect($("body #note")).not.toExist();
			expect($("body #note")).not.toBeVisible();
		});

		it("unhooks the resize event upon deactivation", function() {
			note.unhook = jasmine.createSpy("unhook");
			note.deactivate();
			expect(note.unhook).toHaveBeenCalled();
		});

		it("calculates its bottom position", function() {
			$note = {
				offset: function() { return { top: 10 }; },
				outerHeight: function() { return 40; }
			};
			note = new Note($note);
			expect(note.bottom()).toEqual(50);
		});

		it("can be positioned", function() {
			var top = 100;
			var left = 20;

			$note = { css: jasmine.createSpy("css") };
			note = new Note($note);

			note.positionAt({
				left: left,
				top: top
			});
			expect($note.css).toHaveBeenCalledWith({
				top: top,
				left: left
			});
		});

		it("has an onClose callback", function() {
			var callback = jasmine.createSpy("onClose");

			note.onClose(callback);
			note.activate();

			$button.click();

			expect(callback).toHaveBeenCalled();
		});

	});

})(jQuery);