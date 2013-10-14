(function($, global, undefined) {
	describe("The exposeForTest option", function() {

		it("exposes internals", function() {
			$().codeCallout({ exposeForTest: true });

			var internals = global.__codeCallout;

			expect(internals).toBeDefined();
			expect(internals.Callout).toBeDefined();
			expect(internals.NullCallout).toBeDefined();
			expect(internals.Note).toBeDefined();
			expect(internals.Listing).toBeDefined();
			expect(internals.LineSet).toBeDefined();
			expect(internals.Scroller).toBeDefined();
			expect(internals.Style).toBeDefined();
			expect(internals.LineNumberParser).toBeDefined();
			expect(internals.TriggerReader).toBeDefined();
			expect(internals.LineWrapper).toBeDefined();
			expect(internals.CalloutFactory).toBeDefined();
			expect(internals.NoteFactory).toBeDefined();
			expect(internals.ListingFactory).toBeDefined();
			expect(internals.LineSetFactory).toBeDefined();
			expect(internals.options).toBeDefined();
		});
	});
})(jQuery, window);
