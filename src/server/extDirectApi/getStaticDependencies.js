define(
	'server/extDirectApi/getStaticDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',
		'server/extDirectApi/dependency/getComponentDependencies',
		'server/extDirectApi/dependency/getModuleDependencies',
		'server/extDirectApi/dependency/getSceneDependencies',
		'server/extDirectApi/dependency/getScriptDependencies',
		'server/extDirectApi/dependency/getSystemDependencies',

		'fs',
		'path'
	],
	function(
		createDependencyNode,
		getComponentDependencies,
		getModuleDependencies,
		getSceneDependencies,
		getScriptDependencies,
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
		var SCRIPT = 'script'

		var libraryIdToFilePath = function( projectsRoot, projectName, libraryId ) {
			return path.join( projectsRoot, projectName, "library", libraryId.replace( /\./g, path.sep ) )
		}

		var readMetaData = function( filePath ) {
			if( !fs.existsSync( filePath ) ) return null

			return JSON.parse( fs.readFileSync( filePath, 'utf8' ) )
		}

		var readJavaScriptFileDependencies = function( filePath ) {
			filePath += '.js'

			if( !fs.existsSync( filePath ) ) return []

			return getModuleDependencies( fs.readFileSync( filePath, 'utf8' ) )
		}

		return function( projectsRoot, projectName, libraryId ) {
			var filePathWithoutExtension = libraryIdToFilePath( projectsRoot, projectName, libraryId ),
				metaData                 = readMetaData( filePathWithoutExtension + ".json" )

			if( !metaData ) return

			var type = metaData.type,
				node = createDependencyNode( libraryId, type )

			if( type === SCENE ) {
				var tmp = getSceneDependencies( metaData )
				node.children = tmp.concat( readJavaScriptFileDependencies( filePathWithoutExtension ) )

			} else if( type === SYSTEM ) {
				var tmp = getSystemDependencies( metaData )
				node.children = tmp.concat( readJavaScriptFileDependencies( filePathWithoutExtension ) )

			} else if( type === COMPONENT ) {
				var tmp = getComponentDependencies( metaData )
				node.children = tmp.concat( readJavaScriptFileDependencies( filePathWithoutExtension ) )

			} else if( type === SCRIPT ) {
				var tmp = getScriptDependencies( metaData )
				node.children = tmp.concat( readJavaScriptFileDependencies( filePathWithoutExtension ) )

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
