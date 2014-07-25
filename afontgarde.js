/*! afontgarde - v0.1.3 - 2014-07-25
 * https://github.com/filamentgroup/a-font-garde
 * Copyright (c) 2014 Filament Group c/o Zach Leatherman
 * MIT License */

/*
 * Font-Face Onload Script
 */

;(function( win, doc ) {
		var DELAY = 100,
			TEST_STRING = 'AxmTYklsjo190QW',
			TOLERANCE = 2, // px

			SANS_SERIF_FONTS = 'sans-serif',
			SERIF_FONTS = 'serif',

			parent = doc.createElement( 'div' ),
			html = '<div style="font-family:%s;position:absolute;top:0;left:-9999px;font-size:48px">' + TEST_STRING + '</div>',
			sansSerif,
			serif,
			dimensions,
			appended = false;

		parent.innerHTML = html.replace(/\%s/, SANS_SERIF_FONTS ) + html.replace(/\%s/, SERIF_FONTS );
		sansSerif = parent.firstChild;
		serif = sansSerif.nextSibling;

		// intentional global
		FontFaceOnload = function( fontFamily, options ) {
			var defaultOptions = {
					glyphs: '',
					success: function() {},
					error: function() {},
					timeout: 10000
				},
				startTime = new Date();

			if( !options ) {
				options = {};
			}

			for( var j in defaultOptions ) {
				if( !options.hasOwnProperty( j ) ) {
					options[ j ] = defaultOptions[ j ];
				}
			}

			if( options.glyphs ) {
				sansSerif.innerHTML += options.glyphs;
				serif.innerHTML += options.glyphs;
			}

			if( !appended && doc.body ) {
				appended = true;
				doc.body.appendChild( parent );
				dimensions = {
					sansSerif: {
						width: sansSerif.offsetWidth,
						height: sansSerif.offsetHeight
					},
					serif: {
						width: serif.offsetWidth,
						height: serif.offsetHeight
					}
				};
			}

			// Make sure we set the new font-family after we take our initial dimensions:
			// handles the case where FontFaceOnload is called after the font has already
			// loaded.
			sansSerif.style.fontFamily = fontFamily + ', ' + SANS_SERIF_FONTS;
			serif.style.fontFamily = fontFamily + ', ' + SERIF_FONTS;

			(function checkDimensions() {
				if( Math.abs( dimensions.sansSerif.width - sansSerif.offsetWidth ) > TOLERANCE ||
					Math.abs( dimensions.sansSerif.height - sansSerif.offsetHeight ) > TOLERANCE ||
					Math.abs( dimensions.serif.width - serif.offsetWidth ) > TOLERANCE ||
					Math.abs( dimensions.serif.height - serif.offsetHeight ) > TOLERANCE ) {

					options.success();
				} else if( ( new Date() ).getTime() - startTime.getTime() > options.timeout ) {
					options.error();
				} else {
					setTimeout(function() {
						checkDimensions();
					}, DELAY);
				}
			})();
		};
})( this, this.document );

/*
 * A Font Garde
 */

;(function( w ) {

	var doc = w.document,
		ref,
		css = ['.FONT_NAME.supports-generatedcontent .icon-fallback-text .icon { display: inline-block; }',
			'.FONT_NAME.supports-generatedcontent .icon-fallback-text .text { clip: rect(0 0 0 0); overflow: hidden; position: absolute; height: 1px; width: 1px; }',
			'.FONT_NAME .icon-fallback-glyph .icon:before { font-size: 1em; font-size: inherit; line-height: 1; line-height: inherit; }'];

	function addEvent( type, callback ) {
		if( 'addEventListener' in w ) {
			return w.addEventListener( type, callback, false );
		} else if( 'attachEvent' in w ) {
			return w.attachEvent( 'on' + type, callback );
		}
	}

	AFontGarde = function( fontFamily, options ) {
		var fontFamilyClassName = fontFamily.toLowerCase().replace( /\s/g, '' ),
			executed = false;

		function init() {
			if( executed ) {
				return;
			}
			executed = true;

			if( typeof FontFaceOnload === 'undefined' ) {
				throw 'FontFaceOnload is a prerequisite.';
			}

			if( !ref ) {
				ref = doc.getElementsByTagName( 'script' )[ 0 ];
			}
			var style = doc.createElement( 'style' ),
				cssContent = css.join( '\n' ).replace( /FONT_NAME/gi, fontFamilyClassName );

			style.setAttribute( 'type', 'text/css' );
			if( style.styleSheet ) {
				style.styleSheet.cssText = cssContent;
			} else {
				style.appendChild( doc.createTextNode( cssContent ) );
			}
			ref.parentNode.insertBefore( style, ref );

			var opts = {
				timeout: 5000,
				success: function() {
					// If you’re using more than one icon font, change this classname (and in a-font-garde.css)
					doc.documentElement.className += ' ' + fontFamilyClassName;

					if( options && options.success ) {
						options.success();
					}
				}
			};

			// These characters are a few of the glyphs from the font above */
			if( typeof options === "string" ) {
				opts.glyphs = opts;
			} else {
				for( var j in options ) {
					if( options.hasOwnProperty( j ) && j !== "success" ) {
						opts[ j ] = options;
					}
				}
			}

			FontFaceOnload( fontFamily, opts);
		}

		// MIT credit: filamentgroup/shoestring
		addEvent( "DOMContentLoaded", init );
		addEvent( "readystatechange", init );
		addEvent( "load", init );

		if( doc.readyState === "complete" ){
			init();
		}
	};

})( this );