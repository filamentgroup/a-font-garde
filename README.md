## Uses Cases:

1. Critical Icon
	* Includes fallback text of varying length
	* Has size restrictions, fallback must have a similar size
		* Fallback to a [reliable Unicode equivalent](http://unicode.johnholtripley.co.uk/) (note: very few reliable cross-platform glyphs exist)
		* Fallback to an image (probably bitmap for compatibility)
1. Icon as decoration, does not need a fallback but must not take up space (for proper centering/alignment of neighboring content)

### Markup Patterns

**Support Matrix**

1. CSS
1. `:before` or `:after`
1. @font-face
1. JS (@font-face feature test)

#### Critical Icons with Fallback Text

	<span class=”icon-critical-text”>
		<span aria-hidden="true"></span>
		Fallback Text
	</span>

#### Critical Icons with Fallback Icon

	<span class="icon-critical-text">
		<span class="icon" aria-hidden="true"></span>
		<label>Fallback Text</label>
	</span>

#### Notes:
 * If there were a more reliable way to reproduce aria-hidden using only CSS, we could use only :before/:after instead of a separate element.
* Without aria-hidden, VoiceOver emitted a chirping noise for the icons elements.

## Ligatures:

Requires `text-rendering: optimizeLegibility`. Still has a lot of gnarly WebKit bugs listed on MDN. I believe this is also what caused the [dorkq grunt débâcle](https://github.com/gruntjs/gruntjs.com/issues/81). [Do not use `text-rendering` for ligatures](http://stackoverflow.com/questions/7968795/is-it-safe-to-use-the-css-rule-text-rendering-optimizelegibility-on-all-text/12430050#12430050). Instead use `font-feature-settings`.

    	The browser emphasizes legibility over rendering speed and geometric precision. This enables kerning and optional ligatures.

Source: [MDN text-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering).

 A great article by [Elliot Jay Stocks on Ligatures](http://elliotjaystocks.com/blog/the-fine-flourish-of-the-ligature/). He references using `[font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings)` instead of `text-rendering`. The browser support is slightly worse, but is more reliable.

* Symbolset has [3 different modes](http://webcache.googleusercontent.com/search?q=cache:K1TPKPtfytUJ:blog.symbolset.com/browser-support+&cd=1&hl=en&ct=clnk&gl=us)—only one of which uses ligatures. In Symbolset, the ligatures have individually selectable vertical slices of icon.

Use of ligatures for icon fonts is not recommended due to internationalization concerns (ties presentation to language text). You would need to generate a new font-icon for each language you’d like to support. 

## Private Use Areas (PUA)

*There are 3 PUAs in Unicode but the latter two are only available in UTF-16.*

It’s important to note that the PUA is sometimes used by the default Operating System font.  [See characters used by the PUA](http://www.fileformat.info/info/unicode/block/private_use_area/utf8test.htm) For example, Mac OS Chrome has a variety of characters starting with `0xf7a0`. iOS’s PUA is littered with Emoji characters. Often times when a PUA character is not used, the OS uses its own specified default character. This can often be a rectangle or it can be as obtuse as an alien face (Android). For this reason it is assumed that using the PUA for fallback white-space is visually unreliable.

## Font Face Feature Tests

* [Mat’s `face-off`](https://github.com/filamentgroup/face-off)
* Modernizr
* [Pixel Ambracht](http://pixelambacht.nl/2013/font-face-render-check/)

## Screenreaders

Some screen readers will [read Unicode characters out loud](http://jsbin.com/uGIFeyES/3).

## Evaluate Current Public Offerings

* [Symbolset](http://symbolset.com/)
* [IcoMoon](http://icomoon.io/)
* [Zurb Foundation Icons](http://zurb.com/playground/foundation-icons)
* [Twitter Bootstrap Glyphicons](