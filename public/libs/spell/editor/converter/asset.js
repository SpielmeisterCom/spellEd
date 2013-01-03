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
			var fields          = [ 'version', 'type', 'subtype', 'doc' ],
				content         = _.pick( asset, fields ),
				forbiddenFields = _.union( fields, [ 'myAssetId', 'internalAssetId', 'id', 'name', 'namespace', 'assetId', 'file' ] )

			content.config = {}

			_.each(
				_.keys( asset ),
				function( key ) {
					if( _.indexOf( forbiddenFields, key ) === -1 ) content.config[ key ] = asset[ key ]
				}
			)

			if( asset.file ) content.file = asset.file
			if( asset.assetId ) content.assetId = asset.assetId
			if( content.config && _.size( content.config ) === 0 ) delete content.config

			return content
		}

		var toEditorFormat = function( asset ) {
			var preservedKeys = [ 'id', 'name', 'namespace', 'version', 'type', 'subtype' ],
				result        = _.pick( asset, preservedKeys),
				config        = asset.config || {}

			_.each(
				_.keys( config ),
				function( key ) {
					if( _.indexOf( preservedKeys, key ) > -1 ) throw "Error: Asset '" + result.id +"' overrides preserved key: '" + key + "'"

					result[ key ] = config[ key ]
				}
			)

			if( asset.file ) result.file = asset.file
			if( asset.assetId ) result.assetId = asset.assetId

			return result
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat
		}
	}
)
