define(
	'server/extDirectApi/getStaticDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',
		'server/extDirectApi/dependency/getComponentDependencies',
		'server/extDirectApi/dependency/getSceneDependencies',
		'server/extDirectApi/dependency/getSystemDependencies',

		'fs',
		'path'
	],
	function(
		createDependencyNode,
		getComponentDependencies,
		getSceneDependencies,
		getSystemDependencies,

		fs,
		path
	) {
		'use strict'

		var SCENE = 'scene'
		var SYSTEM = 'system'
		var COMPONENT = 'component'
		var ASSET = 'asset'
		var ENTITY = 'entityTemplate'

		var libraryIdToFilePath = function( projectsRoot, projectName, libraryId ) {
			return path.join( projectsRoot, projectName, "library", libraryId.replace( /\./g, path.sep ) + '.json' )
		}

		var readMetaData = function( filePath ) {
			if( !fs.existsSync( filePath ) ) return null

			return JSON.parse( fs.readFileSync( filePath, 'utf8' ) )
		}

		return function( projectsRoot, projectName, libraryId ) {
			var filePath = libraryIdToFilePath( projectsRoot, projectName, libraryId ),
				metaData = readMetaData( filePath)

			if( !metaData ) return

			var type = metaData.type,
				node = createDependencyNode( libraryId, type )

			if( type === SCENE ) {
				node.children = getSceneDependencies( metaData )

			} else if( type === SYSTEM ) {
				node.children = getSystemDependencies( metaData )

			} else if( type === COMPONENT ) {
				node.children = getComponentDependencies( metaData )

			} else if( type === ENTITY ) {
				//TODO: implement
				node.children = []

			} else if( type === ASSET ) {
				//TODO: implement
				node.children = []
			}

			return node
		}
    }
)
