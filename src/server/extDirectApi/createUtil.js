define(
	'server/extDirectApi/createUtil',
	[
		'path',

		'underscore'
	],
	function(
		path,

		_
	) {
		'use strict'

		return function( rootPath ) {
			var root = path.normalize( rootPath )


//
//						if( withFileType === true && path.extname( filePath ) === ".json" ) {
//							var fileContent = fs.readFileSync( filePath, 'utf8' )
//							try{
//								var object = JSON.parse(fileContent)
//
//								fileInfo.cls  = object.type
//								fileInfo.text = object.name
//
//								if( object.type === "entityTemplate" ) {
//									fileInfo.iconCls = "tree-scene-entity-icon"
//								} else if( object.type === "componentTemplate" ) {
//									fileInfo.iconCls = "tree-component-icon"
//								} else if( object.type === "systemTemplate" ) {
//									fileInfo.iconCls = "tree-system-icon"
//								} else if (object.type === "spriteSheet") {
//									fileInfo.iconCls = "tree-asset-spritesheet-icon"
//								} else if (object.type === "animation") {
//									fileInfo.iconCls = "tree-asset-2danimation-icon"
//								} else if (object.type === "appearance") {
//									fileInfo.iconCls = "tree-asset-2dstaticappearance-icon"
//								} else if(object.type === "font") {
//									fileInfo.iconCls = "tree-asset-2dtextappearance-icon"
//								} else if(object.type === "sound") {
//									fileInfo.iconCls = "tree-asset-sound-icon"
//								} else if(object.type === "keyToActionMap") {
//									fileInfo.iconCls = "tree-asset-keytoactionmap-icon"
//								} else {
//									console.error( "Error: Missing treeIcon for " + object.type )
//								}

			/**
			 *
			 * Main functions
			 *
			 */
			var getPath = function( requestedPath ) {
				var normalize     = path.normalize,
					join          = path.join,
					requestedPath = normalize( requestedPath )

				if( !requestedPath ) throw "Bad requestPath"

				var dir = decodeURIComponent( requestedPath ),
					filePath  = path.resolve( root, normalize(
						( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
					))

				// null byte(s), bad request
				if ( ~filePath.indexOf('\0') )
					throw "Bad requestPath"
				else
					return filePath
			}

            return {
                getPath : getPath
            }
        }
    }
)
