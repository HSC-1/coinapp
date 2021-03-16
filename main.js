(function () {
	'use strict';

	let urls    = {
		'pricemultifull' : '%api_uri%pricemultifull?fsyms=%coin%&tsyms=USD',
		'historical' : '%api_uri%histohour?fsym=%coin%&tsym=USD&limit=%limit%&aggregate=1&e=CCCAGG',
	};
	let options = {
		api_uri : 'https://min-api.cryptocompare.com/data/', // api url
		coins : [ 'BTC', 'ETH', 'ZEC', ], // needed coins
		limit : 24 * 7, // 24 hours for every day in a week
	};

	// global variable for storing template blocks
	let cache = {};

	/**
	 * Function, that put the data to template block, and return complete HTML.
	 *
	 * @param str
	 * @param data
	 * @returns {Function}
	 */
	function tmpl( str, data ) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		let fn = !/\W/.test( str ) ?
			cache[ str ] = cache[ str ] ||
				tmpl( document.getElementById( str ).innerHTML ) :

			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function( "obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +

				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +

				// Convert the template into pure JavaScript
				str
				//.toString()
					.replace( /[\r\t\n]/g, " " )
					.split( "<%" ).join( "\t" )
					.replace( /((^|%>)[^\t]*)'/g, "$1\r" )
					.replace( /\t=(.*?)%>/g, "',$1,'" )
					.split( "\t" ).join( "');" )
					.split( "%>" ).join( "p.push('" )
					.split( "\r" ).join( "\\'" )
				+ "');}return p.join('');" );
		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	};


	/**
	 * Get request.
	 *
	 * @param options
	 * @returns {Promise<any>}
	 */
	function get_contents( options ) {
		return new Promise( function ( resolve, reject ) {
			let xhr = new XMLHttpRequest();
			xhr.open( options.method, options.url );
			xhr.onload  = function () {
				if ( this.status >= 200 && this.status < 300 ) {
					resolve( xhr.response );
				} else {
					reject( {
						status : this.status,
						statusText : xhr.statusText
					} );
				}
			};
			xhr.onerror = function () {
				reject( {
					status : this.status,
					statusText : xhr.statusText
				} );
			};
			if ( options.headers ) {
				Object.keys( options.headers ).forEach( function ( key ) {
					xhr.setRequestHeader( key, options.headers[ key ] );
				} );
			}
			let params = options.params;
			// We'll need to stringify if we've been given an object
			// If we have a string, this is skipped.
			if ( params && typeof params === 'object' ) {
				params = Object.keys( params ).map( function ( key ) {
					return encodeURIComponent( key ) + '=' + encodeURIComponent( params[ key ] );
				} ).join( '&' );
			}
			xhr.send( params );
		} );
	}

	/**
	 * Request data for week.
	 *
	 * @param options
	 * @param url
	 */
	function get__week( url, options ) {


		for ( let i in options.coins ) {
			if ( options.coins.hasOwnProperty( i ) ) {
				let uri  = url;
				uri      = uri.replace( '%api_uri%', options.api_uri );
				uri      = uri.replace( '%coin%', options.coins[ i ] );
				uri      = uri.replace( '%limit%', options.limit );
				let data = get_contents( {
					method : 'GET',
					url : uri
				} )
					.then( function ( result ) {
						//console.log( options.coins[ i ] );
						//console.log( JSON.parse( result ) );
					} )
					.catch( function ( err ) {
						console.error( 'There was an error!', err.statusText );
					} );
			}
		}
	}

	function get_pricemultifull_data( url, options ) {
		let coins = options.coins.join( ',' );
		let uri   = url;
		uri       = uri.replace( '%api_uri%', options.api_uri );
		uri       = uri.replace( '%coin%', coins );
		//console.log( uri );
		let data  = get_contents( {
			method : 'GET',
			url : uri
		} )
			.then( function ( result ) {

				let block = document.getElementById( 'coin' );
				let temp  = document.getElementById( 'js-template__coin' ).innerHTML;
				let time  = new Date().getTime();
				time      = 100 * Math.ceil( new Date().getTime() / 100000 ); // remove milliseconds and round
			                                                                  // hundreds
				result      = JSON.parse( result );
				let display = result.DISPLAY;

				block.innerHTML = '';

				// loop for coins
				for ( let coin_name in display ) {

					// if coin exists
					if ( display.hasOwnProperty( coin_name ) ) {
						let link = 'https://images.cryptocompare.com/sparkchart/' + coin_name + '/USD/latest.png?ts=' + time;
						let coin = display[ coin_name ][ 'USD' ];

						let classes = {
							'PRICE' : '',
							'MKTCAP' : '',
							'CHANGEPCT24HOUR' : '',
						};
						console.log( JSON.stringify( coin ) );

						let fields = [ 'PRICE', 'MKTCAP', 'CHANGEPCT24HOUR' ];

						// loop for fields
						for ( let i in fields ) {

							if ( fields.hasOwnProperty( i ) && coins_old_data.hasOwnProperty( coin_name ) ) {
								let field   = fields[ i ];
								let current = parseFloat( coin[ field ].replace( /\$|\%/g, '' ) );

								// if current field isn't CHANGEPCT24HOUR
								if ( field !== 'CHANGEPCT24HOUR' ) {
									let old = parseFloat( coins_old_data[ coin_name ][ field ].replace( '$', '' ) );

									// determine that was rise up or rise down
									if ( current < old ) {
										classes[ field ] = 'down';
									} else if ( current > old ) {
										classes[ field ] = 'up';
									} else {
										classes[ field ] = '';
									}
								} else {
									if ( current > 0 ) {
										classes[ 'CHANGEPCT24HOUR' ] = 'up';
									} else if ( current < 0 ) {
										classes[ 'CHANGEPCT24HOUR' ] = 'down';
									} else {
										classes[ 'CHANGEPCT24HOUR' ] = '';
									}
								}
							}
						}
						coins_old_data[ coin_name ] = coin;

						block.innerHTML += tmpl( temp, {
							//'FROMSYMBOL' : coin[ 'FROMSYMBOL' ], // simbol
							'coin_name' : coin_name, // coin name
							'PRICE' : coin[ 'PRICE' ], // Price
							'class_price' : classes[ 'PRICE' ],
							'MKTCAP' : coin[ 'MKTCAP' ], // Market Cap
							'class_mktcap' : classes[ 'MKTCAP' ],
							'TOTALVOLUME24HTO' : coin[ 'TOTALVOLUME24HTO' ], // Direct Vol. 24H
							'VOLUME24HOURTO' : coin[ 'VOLUME24HOURTO' ], // Direct Vol. 24H
							'graffic' : link, // graffic
							'CHANGEPCT24HOUR' : coin[ 'CHANGEPCT24HOUR' ], // Chg. 24H
							'class_change' : classes[ 'CHANGEPCT24HOUR' ],
						} );

					}
				}
			} )
			.catch( function ( err ) {
				console.error( 'There was an error!', err.statusText );
			} );

	}

	let coins_old_data = [];
	get_pricemultifull_data( urls[ 'pricemultifull' ], options );
	setInterval( function () {
		get_pricemultifull_data( urls[ 'pricemultifull' ], options );
	}, 3000 );

}());
