define(
	'requireToExt/inject',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'

		/**
		 * Makes the supplied hash of amd modules available in the Ext namespace under 'Ext.amdModules'.
		 *
		 * For example:
		 *
		 * inject( {
		 *     'ace/ace' : ace,
		 * } )
		 *
		 * var ace = Ext.amdModules[ 'ace/ace' ]
		 *
		 * @param modules
		 */
		return function( modules ) {
			if( !Ext ) throw 'Error: Global symbol \'Ext\' is undefined. Could not inject modules.'
			if( !Ext.amdModules ) Ext.amdModules = {}

			_.each(
				modules,
				function( module, name ) {
					Ext.amdModules[ name ] = module
				}
			)
		}
	}
)
