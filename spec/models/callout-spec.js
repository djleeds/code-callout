(function($, undefined) {
	"use strict";

	initializePlugin();
	var Callout = getClass("Callout");

	describe("Callout", function() {

		var callout, mockWindow, mockNote, mockListing, mockLineSet, mockScroller;
		var readingPosition = 30;

		beforeEach(function() {
			mockWindow = { innerHeight: 400 };
			mockNote = {
				activate: jasmine.createSpy("activate"),
				deactivate: jasmine.createSpy("deactivate"),
				bottom: jasmine.createSpy("bottom").and.returnValue(810),
				onClose: jasmine.createSpy("onClose")
			};
			mockListing = {
				top: jasmine.createSpy("top"),
				bottom: jasmine.createSpy("bottom").and.returnValue(800),
				center: jasmine.createSpy("center").and.returnValue(500),
				height: jasmine.createSpy("height").and.returnValue(600)
			};
			mockLineSet = {
				highlight: jasmine.createSpy("highlight"),
				unhighlight: jasmine.createSpy("unhighlight"),
				top: jasmine.createSpy("top").and.returnValue(20)
			};
			mockScroller = { to: jasmine.createSpy("to") };
			callout = new Callout(mockNote, mockListing, mockLineSet, mockScroller, readingPosition, mockWindow);
		});

		it("activates", function() {
			callout.activate();
			expect(mockNote.activate).toHaveBeenCalled();
			expect(mockLineSet.highlight).toHaveBeenCalled();
		});

		it("deactivates", function() {
			callout.deactivate();
			expect(mockNote.deactivate).toHaveBeenCalled();
			expect(mockLineSet.unhighlight).toHaveBeenCalled();
			expect(mockScroller.to).toHaveBeenCalledWith(readingPosition);
		});

		it("deactivates when the note is closed", function() {
			callout.deactivate = jasmine.createSpy("deactivate");
			mockNote.onClose.calls.mostRecent().args[0]();
			expect(callout.deactivate).toHaveBeenCalled();
		});

		it("has a center", function() {
			expect(callout.center()).toEqual(415);
		});

		it("has a position", function() {
			callout.positionCalculator = { scrollTop: jasmine.createSpy("scrollTop") };
			callout.position();
			expect(callout.positionCalculator.scrollTop).toHaveBeenCalled();
		});

		describe("position calculator", function() {

			var calculator;

			beforeEach(function() {
				callout.center = jasmine.createSpy("center").and.returnValue(700);
				calculator = callout.positionCalculator;
			});

			it("calculates the position of a callout", function() {
				expect(calculator.scrollTop()).toEqual(410);
			});

			it("calculates how far a note hangs off the bottom of the code snippet (overhang)", function() {
				expect(calculator.overhang()).toEqual(10);
			});

			it("calculates the longest distance we can scroll from the center of the code snippet", function() {
				expect(calculator.leash()).toEqual(100);
			});

			it("calculates the distance of the callout from the code center", function() {
				expect(calculator.distance()).toEqual(200);
			});

			it("calculates a clamped distance based on the leash", function() {
				expect(calculator.clampedDistance()).toEqual(110);
			});

			it("calculates the center location to scroll to", function() {
				expect(calculator.scrollCenter()).toEqual(610);
			});

		});

	});
})(jQuery);