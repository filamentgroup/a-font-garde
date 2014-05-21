# A Font Garde

**A set of reliable (nay, bulletproof) patterns for icon fonts.**

To start, you’ll probably want to **[read the Filament Group Blog Post](http://filamentgroup.com/lab/bulletproof_icon_fonts)**.

Then, add `afontgarde.css` and `afontgarde.js` to your build to concat up into your web site.

## Uses Cases:

1. Critical Icon
	* Includes fallback text of varying length
	* Has size restrictions, fallback must have a similar size
		* Fallback to a [reliable Unicode equivalent](http://unicode.johnholtripley.co.uk/) (note: very few reliable cross-platform glyphs exist)
		* [Fallback to an image](README-image.md) (not recommended)
1. Icon as decoration, does not need a fallback but must not take up space (for proper centering/alignment of neighboring content)

### Support List

1. CSS including `:before`, `:after` pseudo-elements and `@font-face`
1. JS (`@font-face` loading test)

### [Demos](http://filamentgroup.github.io/a-font-garde/markup.html)

## Decorative Icons (No Fallback Required)

### HTML

	<span class="icon icon-twitter" aria-hidden="true"></span>
	Share on Twitter (Sibling Text)

Make sure you use sibling text here for labeling text—don’t nest the text inside of the icon `span`. We need `aria-hidden` on the icon to make sure it is not read aloud by screen readers.

### CSS

	.fontloaded .icon:before {
		font-family: icomoon;
	}
	.fontloaded .icon-twitter:before {
		content: "\e604";
	}

The `fontloaded` class is added by the FontFaceOnload script, which checks to make sure the Icomoon font has successfully loaded (just because a browser supports font-face doesn’t mean the request will succeed).

## Critical Icons with Fallback Text

If the icon fails, the text must show. Otherwise hide it.

### HTML

	<span class="icon-fallback-text">
		<span class="icon icon-glyph" aria-hidden="true"></span>
		<span class="text">Fallback Text</span>
	</span>

### CSS

*Reuse the decorative icon CSS above.*

## Critical Icons with Fallback Icons

If the icon fails, a fallback icon is shown. Otherwise hide the default icon.

### HTML for fallback to Unicode Glyph

	<span class="icon-fallback-glyph">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<span class="text">Menu</span>
	</span>

### CSS for fallback to Unicode Glyph

	.icon-fallback-glyph .icon-hamburger:before {
		content: "\2261"; /* Hamburger */
		/* Adjust to match the icon font size */
		font-size: 2em;
		line-height: .5;
	}
	/* A-Grade */
	.fontloaded .icon-fallback-glyph .icon-hamburger:before {
		content: "\e601";
	}

Choose your fallback glyph character with care. Cross-browser/platform compatibility may vary. Check John Holt Ripley’s [compatibility tables]( http://unicode.johnholtripley.co.uk/).

## JavaScript

The JavaScript adds the appropriate classes to make sure that the font has loaded.

```
AFontGarde( 'icomoon', '\uE600\uE601\uE602\uE605' );
```

The first argument is the name of the `font-family`. The second argument is a few of the glyphs contained in the new font. We measure these characters to make sure the font has loaded successfully.

## Browser Support

These browsers were tested, full browser support is more comprehensive:

* Chrome 34
* Firefox 29
* Safari 7
* iOS 6, iOS 7 Mobile Safari
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
* Internet Explorer 7 (The icon-fallback-glyph method falls back to text instead of an image due to a lack of :before/:after support. Requires additional Modernizr classes, noted below)

## Options

### Internet Explorer 7 and below

To add support for Internet Explorer 7 and other browsers that don’t support `pseudo-elements` (`:before`, `:after`) use the Modernizr library to provide the pseudo-elements feature test for the `supports-generatedcontent` and `supports-no-generatedcontent` classes.

You can configure Modernizr with the `supports-` classes prefix (make sure to include the `generatedcontent` test) or you can change the `supports-` prefix in a-font-garde. See the “Changing the CSS Prefix” section below for more information.

### Changing the `supports-` CSS Prefix

To use a different CSS Prefix without editing the raw JS and CSS manually, you can optionally clone the repository and change the configuration setting in `package.json`.

```
  "config": {
    "cssprefix": "supports-"
  }
```

Modify with your own CSS prefix and run `grunt` to generate new `afontgarde.css` and `afontgarde.js` files.
