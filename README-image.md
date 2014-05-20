# Critical Icons

## Fallback to Image

Warning: Try to use the other three a-font-garde use cases on the main README before moving forward with this use case. It is less reliable.

### [Demo](http://filamentgroup.github.io/a-font-garde/markup-image.html)


Use a bitmap image like a PNG for better fallback compatibility.

Requires a `@font-face` feature test like Modernizr that provides the `supports-fontface` class to operate correctly.

* Modernizr
* [Mat’s `face-off`](https://github.com/filamentgroup/face-off)
* [Pixel Ambacht](http://pixelambacht.nl/2013/font-face-render-check/): Careful if you support IE8. This test requires an external request and thus may have a race condition for if you’re using background-image for a fallback.

### HTML for fallback to Bitmap

	<!-- Fallback to Background Image -->
	<span class="icon-fallback-img">
		<span class="icon icon-hamburger" aria-hidden="true"></span>
		<span class="text">Menu</span>
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

The fallback background-image is less reliable, since it does not check to make sure the icon font has successfully loaded. We do this so that the background-image request will not be prematurely triggered. If the HTTP request for the font fails, this will show the default Unicode character for `"\e601"`.