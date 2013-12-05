(function( win, undefined ) {
	"use strict";

	var doc = document,
		head = doc.head || doc.getElementsByTagName( "head" )[ 0 ] || doc.documentElement,
		style = doc.createElement( "style" ),
		rule = "@font-face { font-family: 'webfont'; src: 'https://'; }",
		res = false,
		blacklist = (function() {
			var ua = win.navigator.userAgent.toLowerCase(),
				wkvers = ua.match( /applewebkit\/([0-9]+)/gi ) && parseFloat( RegExp.$1 ),
				webos = ua.match( /w(eb)?osbrowser/gi ),
				wppre8 = ua.indexOf( "windows phone" ) > -1 && win.navigator.userAgent.match( /IEMobile\/([0-9])+/ ) && parseFloat( RegExp.$1 ) >= 9,
				oldandroid = wkvers < 533 && ua.indexOf( "Android 2.1" ) > -1;

			return webos || oldandroid || wppre8;
		}()),
		sheet;

	style.type = "text/css";
	head.insertBefore( style, head.firstChild );
	sheet = style.sheet || style.styleSheet;

	if ( !!sheet && !blacklist ) {
		try {
			sheet.insertRule( rule, 0 );
			res = sheet.cssRules[ 0 ].cssText && ( /webfont/i ).test( sheet.cssRules[ 0 ].cssText );
			sheet.deleteRule( sheet.cssRules.length - 1 );
		} catch( e ) { }
	}
	if( res ) {
		var html = document.getElementsByTagName( "html" )[ 0 ];
		html.setAttribute( "class", ( html.getAttribute( "class" ) ? html.getAttribute( "class" ) + " " : "" ) + "supports-fontface" );
	}
}( this ));