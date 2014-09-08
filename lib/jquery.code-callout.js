/*
Copyright (c) 2013-2014 Dave Leeds
License: https://raw.github.com/djleeds/code-callout/master/LICENSE.md
*/

(function($, global, undefined) {
	"use strict";

	$.fn.codeCallout = function(config) {

		var callout = new NullCallout();
		var options = $.extend(defaultOptions, config);
		var styles = defaultStyles;

		if(options.profile in profiles === false) {
			throw("Unrecognized profile " + options.profile + " was requested.");
		}

		var profile = profiles[options.profile];
		if("options" in profile) {
			options = $.extend(options, profile.options);
		}
		if("styles" in profile) {
			styles = $.extend(styles, profile.styles);
		}

		var style = new Style(options.styleId, styles);
		var reader = new TriggerReader(options.listingIdAttribute, options.lineNumbersAttribute, options.noteContentsAttribute);
		var factory = createCalloutFactory(options);

		style.initialize();

		$(this).attr("href", "#").on(options.triggerEventName, function(event){

			var triggerConfig = reader.read(this);
				console.log("wrapping", triggerConfig.listingId, options);

			if(options.shouldWrapLines) {
				var wrapper = new LineWrapper(
					$("#" + triggerConfig.listingId + " " + options.lineWrapContainerSubselector),
					options.wrapperLineClass,
					options.wrapperNumberClassPrefix,
					options.filterLinesToWrap,
					options.beforeLinesOfCodeAreWrapped
				);

				wrapper.wrapListing();
			}

			event.preventDefault();

			callout.deactivate();

			callout = factory.create(triggerConfig, getCurrentReadingPosition());

			callout.activate();
		});

		function createCalloutFactory(options) {
			var noteFactory = new NoteFactory("code-callout-note", "content", options.closeButtonText, "close");
			var listingFactory = new ListingFactory();
			var lineSetFactory = new LineSetFactory(new LineNumberParser(), options.getLineSelector, "code-callout-highlighted");
			var scroller = new Scroller(options.scrollTargetSelector, options.animationDurationInMs);
			return new CalloutFactory(noteFactory, listingFactory, lineSetFactory, scroller, options.noteOffsetFromLine);
		}

		function getCurrentReadingPosition() {
			var maximum = 0;
			$(options.scrollTargetSelector).each(function(index, target) {
				var scrollTop = $(target).scrollTop();
				maximum = (scrollTop > maximum) ? scrollTop : maximum;
			});
			return maximum;
		}

		if(options.exposeForTest) {
			global.__codeCallout = {
				Callout: Callout,
				NullCallout: NullCallout,
				Note: Note,
				Listing: Listing,
				LineSet: LineSet,
				Scroller: Scroller,
				Style: Style,
				LineNumberParser: LineNumberParser,
				TriggerReader: TriggerReader,
				LineWrapper: LineWrapper,
				CalloutFactory: CalloutFactory,
				NoteFactory: NoteFactory,
				ListingFactory: ListingFactory,
				LineSetFactory: LineSetFactory,
				options: options
			};
		}

		return this;
	};

	var Callout = function(note, listing, lineSet, scroll, readingPosition, window) {
		var callout = this;

		note.onClose(function() {
			callout.deactivate();
		});

		this.activate = function() {
			note.activate();
			lineSet.highlight();
			scroll.to(callout.position());
		};

		this.deactivate = function() {
			note.deactivate();
			lineSet.unhighlight();
			scroll.to(readingPosition);
		};

		this.center = function() {
			return (lineSet.top() + note.bottom()) / 2;
		};

		this.positionCalculator = {
			windowHeight: window.innerHeight,

			scrollTop: function() {
				return this.scrollCenter() - (this.windowHeight / 2);
			},

			overhang: function() {
				return Math.max(note.bottom() - listing.bottom(), 0);
			},

			leash: function() {
				return Math.max(listing.height() - this.windowHeight, 0) / 2;
			},

			distance: function() {
				return callout.center() - listing.center();
			},

			clampedDistance: function() {
				var leash = this.leash();
				return Math.max(Math.min(this.distance(), leash + this.overhang()), -leash);
			},

			scrollCenter: function() {
				return listing.center() + this.clampedDistance();
			}
		};

		this.position = function() {
			return this.positionCalculator.scrollTop();
		};
	};

	var NullCallout = function() {
		this.deactivate = function() {};
	};

	var Note = function($note, positionAdvice, $window) {
		var resizeEventName = "resize.code-callout-note";
		var onCloseCallback = function() {};

		this.activate = function() {
			this.attach();
			this.positionAt(positionAdvice());
			this.hook();
			this.show();
		};

		this.deactivate = function() {
			this.hide();
			this.unhook();
			this.detach();
		};

		this.attach = function() {
			$note.appendTo($("body"));
		};

		this.detach = function() {
			$note.remove();
		};

		this.show = function() {
			$note.show();
		};

		this.hide = function() {
			$note.hide();
		};

		this.hook = function() {
			$window.on(resizeEventName, function(event) {
				this.position(positionAdvice());
			});
			$note.find("button.close").on("click", function() {
				onCloseCallback();
			});
		};

		this.unhook = function() {
			$window.off(resizeEventName);
		};

		this.bottom = function() {
			return $note.offset().top + $note.outerHeight();
		};

		this.positionAt = function(position) {
			$note.css(position);
		};

		this.onClose = function(callback) {
			onCloseCallback = callback;
		};
	};

	var Listing = function($listing) {
		this.top = function() {
			return $listing.offset().top;
		};

		this.bottom = function() {
			return this.top() + this.height();
		};

		this.height = function() {
			return $listing.outerHeight();
		};

		this.center = function() {
			return (this.top() + this.bottom()) / 2;
		};
	};

	var LineSet = function($lines, highlightClass) {
		this.highlight = function() {
			$lines.addClass(highlightClass);
		};

		this.unhighlight = function() {
			$lines.removeClass(highlightClass);
		};

		this.top = function() {
			return $lines.first().offset().top;
		};

		this.bottom = function() {
			return $lines.last().offset().top + this.lineHeight();
		};

		this.left = function() {
			return $lines.last().offset().left;
		};

		this.lineHeight = function() {
			return $lines.last().outerHeight();
		};
	};

	var Scroller = function(targetSelector, animationDurationInMs) {
		this.to = function(position) {
			this.selectElement().stop().animate({
				"scrollTop": position
			}, animationDurationInMs);
		};

		this.selectElement = function() {
			return $(targetSelector);
		};
	};

	var Style = function(styleId, styles) {

		this.initialize = function() {
			if(!this.hasBeenWritten()) {
				this.write();
			}
		};

		this.hasBeenWritten = function() {
			return $("#" + styleId).length > 0;
		};

		this.write = function() {
			$("<style />").attr("type", "text/css").attr("id", styleId).text(this.build()).appendTo($("body"));
		};

		this.build = function() {
			var css = "";
			for(var selector in styles) {
				css += selector + "{";
				for(var property in styles[selector]) {
					css += property + ":" + styles[selector][property] + ";";
				}
				css += "} ";
			}
			return css;
		};
	};

	var LineNumberParser = function() {
		this.parse = function(lineNumberString) {
			if(!isNaN(lineNumberString)) {
				return [ Number(lineNumberString) ];
			}
			var result = [];
			var lines = lineNumberString.split(",");
			for(var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if(this.isLineRange(line)) {
					result = result.concat(this.parseLineRange(line));
				} else {
					result.push(Number(line));
				}
			}
			return result;
		};

		this.isLineRange = function(line) {
			return line.indexOf("-") > 0;
		};

		this.parseLineRange = function(rangeString) {
			var result = [];
			var range = rangeString.split("-");
			var begin = range[0], end = range[1];
			for(var i = begin; i <= end; i++) {
				result.push(Number(i));
			}
			return result;
		};
	};

	var TriggerReader = function(listingIdAttribute, lineNumbersAttribute, noteContentsAttribute) {
		this.read = function(element) {
			var $trigger = $(element);
			return {
				listingId: $trigger.data(listingIdAttribute),
				lineNumbers: $trigger.data(lineNumbersAttribute),
				noteContents: $trigger.data(noteContentsAttribute)
			};
		};
	};

	var LineWrapper = function($listing, lineClass, numberClassPrefix, filter, beforeWrap) {
		var self = this;
		var newlineCharacter = "\n";

		this.isAlreadyWrapped = function() {
			return $listing.find("." + lineClass).length > 0;
		};

		this.wrapLine = function(index, line) {
			var oneBasedIndex = index + 1;
			return $("<div />").addClass(lineClass).addClass(numberClassPrefix + oneBasedIndex).html(line + newlineCharacter);
		};

		this.splitIntoLines = function() {
			return filter($listing).html().split(newlineCharacter);
		};

		this.replaceListing = function($newListing) {
			$listing.html($newListing.children("*"));
		};

		this.wrapListing = function() {
			if(this.isAlreadyWrapped()) return;

			var lines = this.splitIntoLines($listing);
			var $modifiedListing = $("<div />");

			$.each(lines, function(index, line) {
				$modifiedListing.append(self.wrapLine(index, line));
			});

			beforeWrap($listing, $modifiedListing);
			this.replaceListing($modifiedListing);
		};
	};

	var CalloutFactory = function(noteFactory, listingFactory, lineSetFactory, scroller, noteOffsetInLines) {
		this.create = function(trigger, readingPosition) {
			var listing = listingFactory.create(trigger.listingId);
			var lineSet = lineSetFactory.create(trigger.listingId, trigger.lineNumbers);
			var advice = this.createPositionAdvice(lineSet);
			var note = noteFactory.create(trigger.noteContents, advice);
			return new Callout(note, listing, lineSet, scroller, readingPosition, global);
		};

		this.createPositionAdvice = function(lineSet) {
			return function() {
				return {
					top: lineSet.bottom() + (lineSet.lineHeight() * noteOffsetInLines),
					left: lineSet.left()
				};
			};
		};
	};

	var NoteFactory = function(noteId, contentClass, closeButtonText, closeButtonClass) {
		this.renderContent = function(text) {
			return $("<div />").addClass(contentClass).text(text);
		};

		this.renderCloseButton = function() {
			return $("<button />").addClass(closeButtonClass).text(closeButtonText);
		};

		this.render = function(noteText) {
			var $content = this.renderContent(noteText);
			var $button = this.renderCloseButton(closeButtonText);
			return $("<div />").attr("id", noteId).append($content).append($button);
		};

		this.create = function(noteText, positionAdvice) {
			var $note = this.render(noteText, closeButtonText);
			return new Note($note, positionAdvice, $(global));
		};
	};

	var ListingFactory = function() {
		this.create = function(listingId) {
			return new Listing(this.selectElement(listingId));
		};

		this.selectElement = function(listingId) {
			return $("#" + listingId);
		};
	};

	var LineSetFactory = function(parser, lineSelector, highlightClass) {
		this.create = function(listingId, lineNumbers) {
			var lineNumbersArray = parser.parse(lineNumbers);
			var $lines = this.selectLines(listingId, lineNumbersArray);
			return new LineSet($lines, highlightClass);
		};

		this.selectLines = function(listingId, lineNumbers) {
			var $lines = $();
			$.each(lineNumbers, function(index, lineNumber) {
				$lines = $lines.add($(lineSelector(listingId, lineNumber)));
			});
			return $lines;
		};
	};

	var defaultOptions = {
		profile: "pre",
		animationDurationInMs: 500,
		closeButtonText: "Continue reading",
		scrollTargetSelector: "html,body",
		triggerEventName: "click",
		listingIdAttribute: "listing",
		lineNumbersAttribute: "lines",
		noteContentsAttribute: "note",
		styleId: "code-callout-styles",
		noteOffsetFromLine: 0.25,
		exposeForTest: false,
		shouldWrapLines: false,
		wrapperLineClass: "code-callout-line",
		wrapperNumberClassPrefix: "number-",
		lineWrapContainerSubselector: "",
		getLineSelector: function(listingId, lineNumber) { throw "Not Implemented"; },
		filterLinesToWrap: function($code) { return $code; },
		beforeLinesOfCodeAreWrapped: function($code, $modifiedCode) { return $modifiedCode; }
	};

	var defaultStyles = {
		".code-callout-line": {
			"width": "100%"
		},
		".code-callout-highlighted": {
			"background-color": "#FFA"
		},
		"#code-callout-note": {
			"position": "absolute",
			"background-color": "#EAEAEA",
			"background": "linear-gradient(to bottom, white 0%, #EAEAEA 100%)",
			"border-radius": "1em",
			"padding": "1em 1em 3em 1em",
			"border": "1px solid #CCC",
			"box-shadow": "0.25em 0.25em 0.5em #CCC",
			"min-width": "7em"
		},
		"#code-callout-note button.close": {
			"font-size": "75%",
			"position": "absolute",
			"bottom": "0",
			"right": "0",
			"margin": "1.5em",
			"white-space": "nowrap"
		}
	};

	var profiles = {
		"gist": {
			options: {
				getLineSelector: function(listingId, lineNumber) {
					return "#" + listingId + " .line-data .line:nth-child(" + lineNumber + ")";
				}
			}
		},
		"jquery-syntax": {
			options: {
				getLineSelector: function(listingId, lineNumber) {
					return "#" + listingId + " .ln" + lineNumber;
				}
			}
		},
		"pre": {
			options: {
				shouldWrapLines: true,
				getLineSelector: function(listingId, lineNumber) {
					return "#" + listingId + " .code-callout-line.number-" + lineNumber;
				}
			}
		},
		"prism": {
			options: {
				shouldWrapLines: true,
				lineWrapContainerSubselector: "code",
				getLineSelector: function(listingId, lineNumber) {
					return "#" + listingId + " .code-callout-line.number-" + lineNumber;
				},
				filterLinesToWrap: function($code) {
					return $code.not(".line-numbers-rows");
				},
				beforeLinesOfCodeAreWrapped: function($code, $modifiedCode) {
					return $modifiedCode.append($code.find(".line-numbers-rows"));
				}
			}
		},
		"syntaxhighlighter": {
			options: {
				getLineSelector: function(listingId, lineNumber) {
					return "#" + listingId + " .line.number" + lineNumber;
				}
			},
			styles: {
				"div.syntaxhighlighter div.container div.code-callout-highlighted": {
					"background-color": defaultStyles[".code-callout-highlighted"]["background-color"] + " !important"
				}
			}
		}
	};

})(jQuery, window);
