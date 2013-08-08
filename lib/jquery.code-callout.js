/*
Copyright (c) 2013 Dave Leeds
License: https://raw.github.com/djleeds/code-callout/master/LICENSE.md
*/

(function($, undefined) {
	"use strict";
	
	$.fn.codeCallout = function(config) {
		
		var options = $.extend(defaultOptions, config);
				
		if(!haveStylesBeenWritten()) {
			writeStyles(defaultStyles);
		}
				
		$(this).attr("href", "#").on(options.triggerEventName, function(event){
			event.preventDefault();
			
			removeExistingCallouts();
			
			var calloutData = getCalloutDataFromTrigger($(this));
			
			var $lines = getLines(calloutData.fileSelector, calloutData.lineNumbers);
			highlightLines($lines);

			var textScrollPosition = getCurrentReadingPosition();
					
			var $note = createNote(calloutData.noteContents, function(event) {
				event.preventDefault();
				onCalloutCloseButtonClicked(textScrollPosition);
			});
			positionNote($note, getCalloutOffset($lines));
			showNote($note);
		
			$(window).on("resize.code-callout", function(event) {
				positionNote($note, getCalloutOffset($lines));
			});

			scrollToPosition(getCodeScrollPosition(calloutData.fileSelector, $note, $lines));			
		});

		function haveStylesBeenWritten(){
			return $("#" + options.styleId).length > 0;
		}
				
		function writeStyles(styles) {
			$("<style type='text/css' id='" + options.styleId + "'>" + buildStyles(styles) + "</style>").appendTo($("body"));		
		}
			
		function buildStyles(styles) {
			var css = "";
			for(var selector in styles) {
				css += selector + "{"
				for(var property in styles[selector]) {
					css += property + ":" + styles[selector][property] + ";"
				}
				css += "} ";
			}
			return css;
		}
			
		function removeExistingCallouts() {
			$("#code-callout-note").remove();
			$(".code-callout-highlighted").removeClass("code-callout-highlighted");
			$(window).off("resize.code-callout");
		}
			
		function getCalloutDataFromTrigger($trigger) {
			return {
				fileSelector: $trigger.data(options.fileSelectorAttribute),
				lineNumbers: parseLineNumbers($trigger.data(options.lineNumbersAttribute)),
				noteContents: $trigger.data(options.noteContentsAttribute)
			};
		}
		
		function parseLineNumbers(lineNumberString) {
			if(!isNaN(lineNumberString)) {
				return [ lineNumberString ];
			}
			var result = [];
			var lines = lineNumberString.split(",");
			for(var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if(isLineRange(line)) {
					result = result.concat(parseLineRange(line));
				} else {
					result.push(Number(line));
				}
			}
			return result;
		}
		
		function isLineRange(lineNumberString) {
			return lineNumberString.indexOf("-") > 0;
		}
		
		function parseLineRange(rangeString) {
			var result = [];
			var range = rangeString.split("-");
			var begin = range[0], end = range[1];
			for(var i = begin; i <= end; i++) {
				result.push(Number(i));
			}
			return result;
		}
		
		function getLines(fileSelector, lineNumbers) {
			var $lines = $();
			for(var i = 0; i < lineNumbers.length; i++) {
				$lines = $lines.add($(options.getLineSelector(fileSelector, lineNumbers[i])));
			}
			return $lines;
		}
		
		function highlightLines($lines) {
			$lines.addClass("code-callout-highlighted");
		}
		
		function unhighlightLines($lines) {
			$lines.removeClass("code-callout-highlighted");
		}
		
		function getCalloutOffset($lines) {
			var $lastLine = $lines.last();
			var offset = $lastLine.offset();
			offset.top += ($lastLine.outerHeight() * options.noteOffsetFromLine);
			return offset;
		}
		
		function createNote(text, onClose) {
			return $("<div />").attr("id", "code-callout-note").append(createNoteContents(text)).append(createCloseButton(onClose));
		}
		
		function createNoteContents(text) {
			return $("<div />").addClass("content").text(text);
		}
		
		function createCloseButton(onClose) {
			var $button = $("<button class='close'>" + options.closeButtonText + "</button>");
			$button.on("click", onClose);
			return $button;
		}
		
		function showNote($note) {
			$note.appendTo($("body"));
		}
		
		function positionNote($note, offset) {
			$note.css({
				top: offset.top,
				left: offset.left
			});
		}
		
		function getCurrentReadingPosition() {
			var maximum = 0;
			$(options.scrollTargetSelector).each(function(index, target) {
				var scrollTop = $(target).scrollTop()
				maximum = (scrollTop > maximum) ? scrollTop : maximum;
			});
			return maximum;
		}
		
		function getCodeScrollPosition(fileSelector, $note, $lines) {
			var highlightTop = $lines.first().offset().top;
			var noteBottom = $note.offset().top + $note.outerHeight();
			var calloutHeight = noteBottom - highlightTop;
			var calloutCenter = (highlightTop + noteBottom) / 2;
			var viewportHeight = window.innerHeight;
			var $code = $("#" + fileSelector);
			var codeBottom = $code.offset().top + $code.outerHeight();
			var overhang = Math.max(noteBottom - codeBottom, 0);
			var leash = Math.max($code.outerHeight() - viewportHeight, 0) / 2;
			var codeCenter = ($code.offset().top + codeBottom) / 2;
			var distance = calloutCenter - codeCenter;
			var allowedDistance = Math.max(Math.min(distance, leash + overhang), -leash);
			var scrollCenter = codeCenter + allowedDistance;
			var scrollTop = scrollCenter - (viewportHeight / 2);
			return scrollTop;
		}
		
		function onCalloutCloseButtonClicked(readingPosition) {
			removeExistingCallouts();
			scrollToPosition(readingPosition);
		}
		
		function scrollToPosition(scrollTop) {
			$(options.scrollTargetSelector).animate({
				"scrollTop": scrollTop
			}, options.animationDurationInMs);
		}
		
		return this;
	}
	
	var defaultOptions = {
		animationDurationInMs: 500,
		closeButtonText: "Continue reading",
		scrollTargetSelector: "html,body",
		triggerEventName: "click",
		fileSelectorAttribute: "file",
		lineNumbersAttribute: "lines",
		noteContentsAttribute: "note",
		getLineSelector: function(fileIdentifier, lineNumber) {
			return "#" + fileIdentifier + " .line-data .line:nth-child(" + lineNumber + ")";
		},
		codeContext: 3,
		styleId: "code-callout-styles",
		noteOffsetFromLine: 1.25
		
	};
	
	var defaultStyles = {
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
	
})(jQuery);
