(function(jQuery, jasmine, undefined) {
	"use strict";

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	var profiles = [ "gist", "jquery-syntax", "pre", "prism", "syntaxhighlighter" ];

	/*jshint loopfunc: true */

	for(var i = 0; i < profiles.length; i++) {

		var profile = profiles[i];
		var frame, $frame;

		var $ = function(selector) {
			return document.getElementById("fixture_iframe").contentWindow.jQuery(selector);
		};

		var loadFixtureInFrame = function(url, ready) {
			$frame = jQuery("<iframe id='fixture_iframe' src='" + url + "'></iframe>");
			$frame.on("load", ready);
			setFixtures($frame);
			frame = $frame[0].contentWindow;
		};

		describe("Code callouts for " + profile, function() {

			var options = {
				animationDurationInMs: 0,
				codeContext: 1.5,
				exposeForTest: true,
				profile: profile
			};

			var $page = "";
			var listingId = "code-sample-1";

			function getScrollTop() {
				return Math.max($page.first().scrollTop(), $page.last().scrollTop());
			}

			function $getLine(lineNumber) {
				return $(frame.__codeCallout.options.getLineSelector(listingId, lineNumber));
			}

			beforeEach(function(done) {
				loadFixtureInFrame("spec/fixtures/" + options.profile + "-fixture.html", function() {
					$page = $("html,body");
					$("a.code-callout").codeCallout(options);
					done();
				});
			});

			afterEach(function() {
				$("#code-callout-note").remove();
				$page.scrollTop(0);
			});

			describe("when initialized", function() {
				it("resets the href attribute on all triggers", function() {
					expect($("a.code-callout").attr("href")).toEqual("#");
				});
			});

			describe("when triggered", function() {

				var readingPosition = "";

				beforeEach(function() {
					var $trigger = $("#line-1-trigger");
					$page.scrollTop($trigger.offset().top);
					readingPosition = getScrollTop();
					$trigger.click();
				});

				it("highlights the line", function() {
					expect($getLine(1)).toHaveClass("code-callout-highlighted");
				});

				describe("the callout", function() {

					it("is created", function() {
						expect($("#code-callout-note")).toExist();
					});

					it("has the expected content", function() {
						var expectedContent = $("#line-1-trigger").data("note");
						expect($("#code-callout-note .content").text()).toEqual(expectedContent);
					});

					describe("close button", function() {

						it("exists", function() {
							expect($("#code-callout-note button")).toExist();
						});

						it("has the expected label", function() {
							expect($("#code-callout-note button").text()).toEqual("Continue reading");
						});

						describe("when clicked", function() {

							beforeEach(function() {
								$("#code-callout-note button").click();
							});

							it("closes the callout", function() {
								expect($("#code-callout-note")).not.toExist();
							});

							it("removes the highlights", function() {
								expect($("#file-filename-ext-LC1")).not.toHaveClass("code-callout-highlighted");
							});

							it("scrolls back to the reading position", function() {
								expect(getScrollTop()).toEqual(readingPosition);
							});

						});
					});
				});

				describe("when another callout is triggered", function() {

					var $existingHighlightedLines = "";
					var $existingCallout = "";

					beforeEach(function() {
						$existingHighlightedLines = $(".code-callout-highlighted");
						$existingCallout = $("#code-callout-note");
						$("#line-4-trigger").click();
					});

					it("closes the first callout", function() {
						expect($("body")).not.toContainHtml($existingCallout.html());
					});

					it("removes the highlights from the first callout", function() {
						expect($existingHighlightedLines).not.toHaveClass("code-callout-highlighted");
					});

				});

			});

			describe("when triggered for multi-line", function() {

				beforeEach(function() {
					$("#multi-line-trigger").click();
				});

				it("highlights the chosen lines", function() {
					expect($getLine(1)).toHaveClass("code-callout-highlighted");
					expect($getLine(2)).toHaveClass("code-callout-highlighted");
					expect($getLine(3)).toHaveClass("code-callout-highlighted");
					expect($getLine(4)).not.toHaveClass("code-callout-highlighted");
					expect($getLine(5)).toHaveClass("code-callout-highlighted");
				});

			});

		});
	}

})(jQuery, jasmine);
