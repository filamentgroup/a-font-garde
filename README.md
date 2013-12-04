## Font Icons: Speed Bumps

### Ligatures

Requires `text-rendering: optimizeLegibility`. Still has a lot of gnarly WebKit bugs listed on MDN. I believe this is also what caused the [dorkq grunt débâcle](https://github.com/gruntjs/gruntjs.com/issues/81). [Do not use `text-rendering` for ligatures](http://stackoverflow.com/questions/7968795/is-it-safe-to-use-the-css-rule-text-rendering-optimizelegibility-on-all-text/12430050#12430050). Instead use `font-feature-settings`.

	The browser emphasizes legibility over rendering speed and geometric precision. This enables kerning and optional ligatures.

Source: [MDN text-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering).

 A great article by [Elliot Jay Stocks on Ligatures](http://elliotjaystocks.com/blog/the-fine-flourish-of-the-ligature/). He references using [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) instead of `text-rendering`. The browser support is slightly worse, but is more reliable.

* Symbolset has [3 different modes](http://webcache.googleusercontent.com/search?q=cache:K1TPKPtfytUJ:blog.symbolset.com/browser-support+&cd=1&hl=en&ct=clnk&gl=us)—only one of which uses ligatures. In Symbolset, the ligatures have individually selectable vertical slices of icon.

Use of ligatures for icon fonts is not recommended due to internationalization concerns (ties presentation to language text). To avoid i18n-performance bloat, you’d need to generate a new font-icon for each language you’re supporting. 

### Private Use Areas (PUA)

*There are 3 PUAs in Unicode but the latter two are only available in UTF-16.*

It’s important to note that the PUA is sometimes used by the default Operating System font.  [See characters used by the PUA](http://www.fileformat.info/info/unicode/block/private_use_area/utf8test.htm) For example, Mac OS Chrome has a variety of characters starting with `0xf7a0`. iOS’s PUA is littered with Emoji characters. Often times when a PUA character is not used, the OS uses its own specified default character. This can often be a rectangle or it can be as obtuse as an alien face (Android). For this reason it is assumed that using the PUA for a fallback glyph (or assuming fallback white-space) is visually unreliable.

### Screenreaders

Some screen readers will [read an unknown subset of Unicode characters out loud](http://jsbin.com/uGIFeyES/3).

## Font Face Feature Tests

* [Mat’s `face-off`](https://github.com/filamentgroup/face-off)
* Modernizr
* [Pixel Ambracht](http://pixelambacht.nl/2013/font-face-render-check/)

## A Font Garde

**A set of reliable patterns for icon fonts**

### Uses Cases:

1. Critical Icon
	* Includes fallback text of varying length
	* Has size restrictions, fallback must have a similar size
		* Fallback to a [reliable Unicode equivalent](http://unicode.johnholtripley.co.uk/) (note: very few reliable cross-platform glyphs exist)
		* Fallback to an image (probably bitmap for compatibility)
1. Icon as decoration, does not need a fallback but must not take up space (for proper centering/alignment of neighboring content)

### Support Matrix

1. CSS
1. `:before` or `:after`
1. @font-face (and a check to make sure the font loads successfully)
1. JS (@font-face feature test)

### [See all the Demos](http://filamentgroup.github.io/a-font-garde/markup.html)

#### Decorative Icons (No Fallback Required)

##### HTML

	<span class="icon icon-facebook" aria-hidden="true"></span>
	Share on Facebook (Sibling Text)

Make sure you use sibling text here for labels—don’t nest the text inside of the icon `span`. We need `aria-hidden` on the icon to make sure it is not read aloud by screen readers.

##### CSS

	.supports-fontface.icomoon .icon:before {
		font-family: icomoon;
	}
	.supports-fontface.icomoon .icon-glyph:before {
		content: "\XXXX"; /* Your glyph, preferably located in the Private Use Area */
	}

The font-face feature test adds the `supports-fontface` class. We’re using our [face-off](https://github.com/filamentgroup/face-off) feature test. If you use [Modernizr](http://modernizr.com/docs/#features-css), replace with `fontface`.

The `icomoon` class is added by the FontFaceOnload script, which checks to make sure the font has successfully loaded (just because a browser supports font-face doesn’t mean the request will succeed).

#### Critical Icons with Fallback Text

If the icon fails, the text must show. Otherwise hide it.

##### HTML

	<span class="icon-fallback-text">
		<!-- requires an element for aria-hidden -->
		<span class="icon icon-glyph" aria-hidden="true"></span>
		<label>Fallback Text</label>
	</span>

##### CSS

	.icon-fallback-text .icon {
		display: none;
	}
	/* A-grade */
	.supports-fontface.icomoon .icon-fallback-text .icon {
		display: inline-block;
	}
	.supports-fontface.icomoon .icon-fallback-text label {
		/* Visually hide but accessible (h5bp.com) */
		clip: rect(0 0 0 0);
		overflow: hidden;
		position: absolute;
		height: 1px;
		width: 1px;
	}
	.supports-fontface.icomoon .icon:before {
		font-family: icomoon;
	}
	.supports-fontface.icomoon .icon-glyph:before {
		content: "\XXXX"; /* Your glyph, preferably located in the Private Use Area */
	}


#### Critical Icons with Fallback Icons

If the icon fails, a fallback icon is shown. Otherwise hide the default icon.

##### HTML

	<!-- Fallback to Unicode Glyph -->
	<span class="icon-fallback-glyph">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

	<!-- Fallback to Background Image -->
	<span class="icon-fallback-img">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<label>Menu</label>
	</span>

##### CSS

	.icon-fallback-glyph label,
	.icon-fallback-img label {
		/* visually hide but accessible (h5bp.com) */
		clip: rect(0 0 0 0);
		overflow: hidden;
		position: absolute;
		height: 1px;
		width: 1px;
	}
	/* Fallback Glyph (Adjusted font-size and line-height to match) */
	.icon-fallback-glyph .icon-hamburger:before {
		content: "\2261"; /* Hamburger */
		font-size: 2em;
		line-height: .5;
	}
	/* Fallback Bitmap (Must set width/height) */
	.icon-fallback-img .icon-hamburger:before {
		content: "";
		background-image: url('fonts/png/hamburger.png');
		background-repeat: no-repeat;
		display: inline-block;
		width: 1em;
		height: 1em;
	}
	/* A-Grade */
	.supports-fontface.icomoon .icon:before {
		font-family: icomoon;
	}
	.supports-fontface.icomoon .icon-fallback-glyph .icon-hamburger:before {
		content: "\e601";
		font-size: inherit;
		line-height: inherit;
	}
	.supports-fontface .icon-fallback-img .icon-hamburger:before {
		content: "\e601";
		background-image: none;
	}

Choose your fallback glyph character with care. Cross-broswer/platform compatibility may vary. Check the [compatibility tables]( http://unicode.johnholtripley.co.uk/).

The fallback background-image is marginally less reliable, since it does not check to make sure the icon font has successfully loaded. We do this so that the background-image request will not be prematurely triggered. If the HTTP request for the font fails, this will show the default Unicode character for `"\e601"`.

#### Notes:

* If there were a more reliable way to reproduce aria-hidden using only CSS, we could use only :before/:after instead of a separate element.
* Without aria-hidden, VoiceOver emitted a chirping noise for the icons elements.

## Evaluate Current Public Offerings

* [Symbolset](http://symbolset.com/)
* [IcoMoon](http://icomoon.io/)
* [Zurb Foundation Icons](http://zurb.com/playground/foundation-icons)
* Twitter Bootstrap Glyphicons


