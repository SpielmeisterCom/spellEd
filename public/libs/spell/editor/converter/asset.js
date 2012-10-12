define(
	'spell/editor/converter/asset',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'

		var toEngineFormat = function( asset ) {
			var content = _.pick( asset, 'version','type','subtype','doc', 'config')

			if( asset.file ) content.file = asset.file
			if( asset.assetId ) content.assetId = asset.assetId
			if( content.config && _.size( content.config ) === 0 ) delete content.config

			return content
		}

		return {
			toEngineFormat : toEngineFormat
		}
	}
)
