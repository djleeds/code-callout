require("./spec-setup");

(function($, undefined) {
	"use strict";

	var fixtureFilePath = require("path").resolve(__dirname, "gist-fixture.html");
	var html = require("fs").readFileSync(fixtureFilePath, "utf-8");

	describe("Code callouts", function() {

		var options = {
			animationDurationInMs: 0,
			codeContext: 1.5
		};

		var $page = "";

		function getScrollTop() {
			return Math.max($page.first().scrollTop(), $page.last().scrollTop());
		}

		beforeEach(function() {
			setFixtures(html);

			$page = $("html,body");
			$("a.code-callout").codeCallout(options);
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
				expect($("#file-filename-ext-LC1")).toHaveClass("code-callout-highlighted");
			});

			it("scrolls the page away from the reading position", function() {
				expect(getScrollTop()).not.toEqual(readingPosition);
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
					expect($("body")).not.toContain($existingCallout);
				});

				it("removes the highlights from the first callout", function() {
					expect($existingHighlightedLines).not.toHaveClass("code-callout-highlighted");
				});

			});

		});

		describe("when triggered for mult-line", function() {

			beforeEach(function() {
				$("#multi-line-trigger").click();
			});

			it("highlights the chosen lines", function() {
				expect($("#file-filename-ext-LC1")).toHaveClass("code-callout-highlighted");
				expect($("#file-filename-ext-LC2")).toHaveClass("code-callout-highlighted");
				expect($("#file-filename-ext-LC3")).toHaveClass("code-callout-highlighted");
				expect($("#file-filename-ext-LC4")).not.toHaveClass("code-callout-highlighted");
				expect($("#file-filename-ext-LC5")).toHaveClass("code-callout-highlighted");
			});

		});

	});
})(jQuery);
