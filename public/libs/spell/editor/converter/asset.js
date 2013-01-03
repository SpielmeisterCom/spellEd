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
				asset,
				function( value, key ) {
					if( _.indexOf( forbiddenFields, key ) === -1 ) content.config[ key ] = value
				}
			)

			if( asset.file ) content.file = asset.file
			if( asset.assetId ) content.assetId = asset.assetId
			if( content.config && _.size( content.config ) === 0 ) delete content.config

			return content
		}

		var toEditorFormat = function( asset ) {
			var result = _.pick( asset, 'id', 'name', 'namespace', 'version', 'type', 'subtype' )

			_.each(
				asset.config,
				function( value, key ) {
					result[ key ] = value
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
