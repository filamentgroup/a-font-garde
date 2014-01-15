# A Font Garde

**A set of reliable (nay, bulletproof) patterns for icon fonts.**

To start, you’ll probably want to **[read the Filament Group Blog Post](http://filamentgroup.com/lab/bulletproof_icon_fonts)**.

Then, add `afontgarde.css` and `afontgarde.js` to your build to concat up into your web site.

Also requires a `@font-face` feature test:

## Font Face Feature Tests

Really, you can use these approaches with any font-face feature test that supplies the `supports-fontface` class. However, here we’re also assuming the use of Modernizr’s pseudo-elements feature test to supply `supports-generatedcontent` and `supports-no-generatedcontent` classes.

* Modernizr
* [Mat’s `face-off`](https://github.com/filamentgroup/face-off)
* [Pixel Ambracht](http://pixelambacht.nl/2013/font-face-render-check/): Careful if you support IE8. This test requires an external request and thus may have a race condition for if you’re using background-image for a fallback.

## Uses Cases:

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

## Decorative Icons (No Fallback Required)

### HTML

	<span class="icon icon-twitter" aria-hidden="true"></span>
	Share on Twitter (Sibling Text)

Make sure you use sibling text here for labels—don’t nest the text inside of the icon `span`. We need `aria-hidden` on the icon to make sure it is not read aloud by screen readers.

### CSS

	.supports-fontface.fontloaded .icon:before {
		font-family: icomoon;
	}
	/* Icons */
	.supports-fontface.fontloaded .icon-twitter:before {
		content: "\e604";
	}

Here, we’re using Modernizr (with the `supports-` classes prefix) tests for `fontface` and `generatedcontent`.

The `fontloaded` class is added by the FontFaceOnload script, which checks to make sure the Icomoon font has successfully loaded (just because a browser supports font-face doesn’t mean the request will succeed).

## Critical Icons with Fallback Text

If the icon fails, the text must show. Otherwise hide it.

### HTML

	<span class="icon-fallback-text">
		<!-- requires an element for aria-hidden -->
		<span class="icon icon-glyph" aria-hidden="true"></span>
		<label>Fallback Text</label>
	</span>

### CSS

*Reuse the decorative icon CSS above.*

## Critical Icons with Fallback Icons

If the icon fails, a fallback icon is shown. Otherwise hide the default icon.

### HTML for fallback to Unicode Glyph

	<span class="icon-fallback-glyph">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

### CSS for fallback to Unicode Glyph

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

### HTML for fallback to Bitmap

	<!-- Fallback to Background Image -->
	<span class="icon-fallback-img">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

### CSS for fallback to Bitmap

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

## Browser Support (using Modernizr Feature Test)

* Chrome 31
* Firefox 25
* Safari 7
* iOS 7 Safari
* Opera 12
* Blackberry OS 7
* Android 2.3
* Internet Explorer 8, 9, 10, 11

### Fallback Experience

* Opera Mini
* Windows Phone 7.5 (Note: The icon-fallback-img method fails here because of a Modernizr false positive—an issue has been filed and resolved)
* Opera 9
* Blackberry OS 5
* Blackberry OS 6 (technically supports SVG @font-face, but it’s horribly buggy. So we isolate the SVG entry to newer WebKit and opt into the fallback experience)
* Internet Explorer 7 (Exception: The icon-fallback-glyph method falls back to text instead of an image due to a lack of :before/:after support)


