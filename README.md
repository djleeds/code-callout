# Code Callout

**Code Callout** is a [jQuery](http://jquery.com) plugin that allows you to create links
in your webpages to highlight and comment on a block of code in the page.  When you click a link, the page scrolls to the indicated lines, highlights them, and pops up a note.  When you're done examining the code, you click the "continue reading" button, and you'll scroll back to the text.

Right now, it works with embedded [Gists](https://gist.github.com), although you might be
able to get it to work with other types of code listings with some configuration changes.

## How It Works

1. **Embed your code listing** into your web page (e.g., using the *Embed this gist* code)
2. **Wrap the code listing** with a tag that has an id attribute
3. **Add some text** about the code listing somewhere on your page
4. **Make a link** around some of your text, adding data attributes to indicate which lines from which listing you want to highlight, as well as a comment for a popup.
5. **Call .codeCallout()** on a jQuery collection of your links

## Quick Example

Here's a snippet of HTML demonstrating how you can create a callout.  Naturally, this assumes you've already loaded in both jQuery and the Code Callout plugin.

```html
<!-- Notice the Gist script is wrapped with a div tag that we can target by id. -->
<div id="listing-1">
    <script src="https://gist.github.com/djleeds/e31ae1d8567ef00fab9a.js"></script>
</div>

<!-- Here's where we write commentary about the code listing above. -->
<p>
    This is a code listing for a Square class. Notice how we
    <!-- Here's the trigger link. We'll give it a class name that we use in the call to the plugin below. -->
    <a class="callout-trigger"
        data-listing="listing-1"
        data-lines="3,5-7"
        data-note="The member variable is private but we provide a setter."
        >provide a setter</a>
    for the length member.
</p>

<!-- Here's where we tell the plugin to create callouts for the trigger links, which we hooked by class name. -->
<script>
    $(".callout-trigger").codeCallout();
</script>
```

## Trigger Attributes

Triggers are links that initiate a code callout.  Be sure to add a class name to them so that you can easily send them to the jQuery plugin.  Here are the attributes that you must specify.

1. ``data-listing`` - The id of the code listing.  Make sure you wrap the Gist's ``<script>`` tag with an element that has an id attribute on it.  This is required, because Code Callout allows you to have multiple code listings on a single page.
2. ``data-lines`` - The line numbers in the code listing that you want to highlight. This can include:
    - A single line number, such as ``3``
    - A line range, such as ``5-7``
    - A list of line numbers, such as ``3,5,7``
    - A combination of these, such as ``1,3,5-7``
3. ``data-note`` - This is the text of the note that will show below the highlighted lines. At the moment, this must be text only. HTML will be supported in future versions.

## Customizing

Here's how you can customize the plugin to work with your site.

### CSS

For most of the styles, Code Callout writes a ``<style>`` tag rather than setting the styles on the elements directly. This allows you to override the default CSS by using more specific selectors. For example, Code Callout writes a rule with a selector of ``.code-callout-highlighted``, but you can override this with a more specific CSS rule like ``body .code-callout-highlighted``.

Here are some of the CSS rules you can override:

- ``.code-callout-highlighted`` - The lines highlighted in your code listing
- ``#code-callout-note`` - The note that appears below the highlighted lines
- ``#code-callout-note button.close`` The *Continue Reading* button inside the callout note

### Plugin Options

You can pass in a hash with these properties.

- ``animationDurationInMs`` - How long you want it to take (in milliseconds) to scroll from the text to the code, and code to the text. Defaults to 500ms.
- ``closeButtonText`` -  The text you want on the button inside the callout note.  Defaults to "Continue reading".

Here's an example of calling the plugin with options.

```js
$(".callout-trigger").codeCallout({
    animationDurationInMs: 1000,
    closeButtonText: "OK"
});
```

## Issues

If you find a bug, feel free to report it in the [Issue Tracker](https://github.com/djleeds/code-callout/issues).  Or if you're feeling ambitious, fork the repo, fix it up and send a pull request. Be sure to add a Jasmine example for any pull request you make.
