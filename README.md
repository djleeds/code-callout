# Code Callout

**Code Callout** is a [jQuery](http://jquery.com) plugin that allows you to create links
in your webpages to highlight and comment on a block of code in the page.  When you click a link, the page scrolls to the indicated lines, highlights them, and pops up a note.  When you're done examining the code, you click the "continue reading" button, and you'll scroll back to the text.

Right now, it works with embedded [Gists](https://gist.github.com), although you might be 
able to get it to work with other types of code listings with some configuration changes.

Here's how it works:

1. You embed your code listing into your web page using the "Embed this gist" link, and wrap it with a tag.
2. You add some text about the code listing.
3. You make a link around some of your text, adding attributes to indicate which lines from which listing you want to highlight, as well as a comment for a popup.
4. You use a jQuery selector to select those links, and call .codeCallout() on it.

Here's a quick example.

```
    <div id="listing-1">
        <script src="https://gist.github.com/djleeds/e31ae1d8567ef00fab9a.js"></script>
    </div>
    <p>
        This is a code listing for a Square class. Notice how we 
        <a class="callout-trigger"
            data-file="listing-1"
            data-lines="3,5-7"
            data-note="The member variable is private but we provide a setter."
            >provide a setter</a>
        for the length member.
    </p>
    <script>$(".callout-trigger").codeCallout();</script>
```

