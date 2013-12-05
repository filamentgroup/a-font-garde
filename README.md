# A Font Garde

**A set of reliable (nay, bulletproof) patterns for icon fonts.**

## Font Icons: Speed Bumps

### Ligatures

Requires `text-rendering: optimizeLegibility`. Still has a lot of gnarly WebKit bugs listed on MDN. I believe this is also what caused the [dorkq grunt débâcle](https://github.com/gruntjs/gruntjs.com/issues/81). [Do not use `text-rendering` for ligatures](http://stackoverflow.com/questions/7968795/is-it-safe-to-use-the-css-rule-text-rendering-optimizelegibility-on-all-text/12430050#12430050). Instead use `font-feature-settings`.

	The browser emphasizes legibility over rendering speed and geometric precision. This enables kerning and optional ligatures.

Source: [MDN text-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering).

A great article by [Elliot Jay Stocks on Ligatures](http://elliotjaystocks.com/blog/the-fine-flourish-of-the-ligature/). He references using [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) instead of `text-rendering`. The browser support is slightly worse, but is more reliable.

Take note that ligatures cannot contain whitespace (ruling out multiple words). The [Icomoon](icomoon.io) tool warns also that `Ligatures with special characters or numbers may not work as expected in some browsers.`

Another concern with ligatures is the internationalization of content (ties presentation to language text). To avoid i18n-performance bloat, you’d need to generate a new font-icon for each language you’re supporting. 

### Private Use Areas (PUA)

*There are 3 PUAs in Unicode but the latter two are only available in UTF-16.*

It’s important to note that the PUA is sometimes used by the default Operating System font.  [See characters used by the PUA](http://www.fileformat.info/info/unicode/block/private_use_area/utf8test.htm) For example, Mac OS Chrome has a variety of characters starting with `0xf7a0`. iOS’s PUA is littered with Emoji characters. Often times when a PUA character is not used, the OS uses its own specified default character. This can often be a rectangle or it can be as obtuse as an alien face (Android). For this reason it is assumed that using the PUA for a fallback glyph (or assuming fallback white-space) is visually unreliable.

### Screenreaders

Some screen readers will [read an unknown subset of Unicode characters out loud](http://jsbin.com/uGIFeyES/3).

## Font Face Feature Tests

* [Mat’s `face-off`](https://github.com/filamentgroup/face-off)
* Modernizr
* [Pixel Ambracht](http://pixelambacht.nl/2013/font-face-render-check/): Careful if you support IE8. This test requires an external request and thus may have a race condition for if you’re using background-image for a fallback.

## Markup Patterns

### Uses Cases:

1. Critical Icon
	* Includes fallback text of varying length
	* Has size restrictions, fallback must have a similar size
		* Fallback to a [reliable Unicode equivalent](http://unicode.johnholtripley.co.uk/) (note: very few reliable cross-platform glyphs exist)
		* Fallback to an image (probably bitmap for compatibility)
1. Icon as decoration, does not need a fallback but must not take up space (for proper centering/alignment of neighboring content)

### Support List

1. CSS
1. `:before` or `:after`
1. @font-face (and a check to make sure the font loads successfully)
1. JS (@font-face feature test)

### [See all the Demos](http://filamentgroup.github.io/a-font-garde/markup.html)

#### Decorative Icons (No Fallback Required)

##### HTML

	<span class="icon icon-twitter" aria-hidden="true"></span>
	Share on Twitter (Sibling Text)

Make sure you use sibling text here for labels—don’t nest the text inside of the icon `span`. We need `aria-hidden` on the icon to make sure it is not read aloud by screen readers.

##### CSS

	.supports-fontface.fontloaded .icon:before {
		font-family: icomoon;
	}
	/* Icons */
	.supports-fontface.fontloaded .icon-twitter:before {
		content: "\e604";
	}

Here, we’re using Modernizr (with the `supports-` classes prefix) tests for `fontface` and `generatedcontent`.

The `fontloaded` class is added by the FontFaceOnload script, which checks to make sure the Icomoon font has successfully loaded (just because a browser supports font-face doesn’t mean the request will succeed).

#### Critical Icons with Fallback Text

If the icon fails, the text must show. Otherwise hide it.

##### HTML

	<span class="icon-fallback-text">
		<!-- requires an element for aria-hidden -->
		<span class="icon icon-glyph" aria-hidden="true"></span>
		<label>Fallback Text</label>
	</span>

##### CSS

*Reuse the decorative icon CSS above.*

#### Critical Icons with Fallback Icons

If the icon fails, a fallback icon is shown. Otherwise hide the default icon.

##### HTML for fallback to Unicode Glyph

	<span class="icon-fallback-glyph">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

##### CSS for fallback to Unicode Glyph

	.icon-fallback-glyph .icon-hamburger:before {
		content: "\2261"; /* Hamburger */
		/* Adjust to match the icon font size */
		font-size: 2em;
		line-height: .5;
	}
	/* A-Grade */
	.supports-fontface.fontloaded .icon-fallback-glyph .icon-hamburger:before {
		content: "\e601";
	}

Choose your fallback glyph character with care. Cross-browser/platform compatibility may vary. Check John Holt Ripley’s [compatibility tables]( http://unicode.johnholtripley.co.uk/).

##### HTML for fallback to Bitmap

	<!-- Fallback to Background Image -->
	<span class="icon-fallback-img">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

##### CSS for fallback to Bitmap

	.icon-fallback-img .icon-hamburger {
		/* Adjust to match the icon font size */
		width: 1em;
		height: 1em;
		/* Note: BB5 doesn’t support background-images on pseudo-elements */
		background: url("fonts/png/hamburger.png") no-repeat;
	}
	/* A-Grade */
	.supports-fontface .icon-fallback-img .icon-hamburger:before {
		font-family: icomoon;
		content: "\e601";
	}

The fallback background-image is marginally less reliable, since it does not check to make sure the icon font has successfully loaded. We do this so that the background-image request will not be prematurely triggered. If the HTTP request for the font fails, this will show the default Unicode character for `"\e601"`.

#### Notes:

* If there were a more reliable way to reproduce aria-hidden using only CSS, we could use only :before/:after instead of a separate element.
* Without aria-hidden, VoiceOver emitted a chirping noise for the icons elements.

### Tested On (using Modernizr Feature Test)

* Chrome 31
* Firefox 25
* Safari 7
* iOS 7 Safari
* Opera 12
* Blackberry OS 7
* Android 2.3
* Internet Explorer 8, 9, 10, 11

#### Fallback Experience

* Opera Mini
* Windows Phone 7.5 (Note: The icon-fallback-img method fails here because of a Modernizr false positive)
* Opera 9
* Blackberry OS 5
* Internet Explorer 7 (Exception: The icon-fallback-glyph method falls back to text due to a lack of :before/:after support)

## Icon Fonts Code Reviewed

### [Symbolset](http://symbolset.com/)

Has [3 different modes](http://webcache.googleusercontent.com/search?q=cache:K1TPKPtfytUJ:blog.symbolset.com/browser-support+&cd=1&hl=en&ct=clnk&gl=us) of operation:
* Unicode uses a Unicode character as HTML content. When the font is not available, the default glyph is shown. This can cause unintended consequences when glyphs are mapped to the PUA.
* The CSS Classes approach uses `:before`/`:after` on a single parent element to add the icon. This means they are not hidden properly from screen readers.
* The Keywords approach uses ligatures, the problems with which are documented above. Some of the examples on the Symbolset site include `navigateleft` and `navigateright` which may not be ideal for screen readers.

### Others

Both [Zurb Foundation Icons](http://zurb.com/playground/foundation-icons) and [Twitter Bootstrap Glyphicons](http://getbootstrap.com/components/#glyphicons) use the same approach as Symbolset CSS Classes.



