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

			if( options ) {
				for( var j in options ) {
					if( options.hasOwnProperty( j ) ) {
						defaultOptions[ j ] = options[ j ];
					}
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