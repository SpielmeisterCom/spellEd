define(
	'server/extDirectApi/getStaticDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',
		'server/extDirectApi/dependency/getComponentDependencies',
		'server/extDirectApi/dependency/getModuleDependencies',
		'server/extDirectApi/dependency/getSceneDependencies',
		'server/extDirectApi/dependency/getScriptDependencies',
		'server/extDirectApi/dependency/getSystemDependencies'
	],
	function(
		createDependencyNode,
		getComponentDependencies,
		getModuleDependencies,
		getSceneDependencies,
		getScriptDependencies,
		getSystemDependencies
	) {
		'use strict'

		var SCENE = 'scene'
		var SYSTEM = 'system'
		var COMPONENT = 'component'
		var ASSET = 'asset'
		var ENTITY = 'entityTemplate'
		var SCRIPT = 'script'

		return function( projectsRoot, projectName, libraryId, metaData, scriptContent ) {
			var type = metaData.type,
				node = createDependencyNode( libraryId, type )

			if( type === SCENE ) {
				node.children = getSceneDependencies( metaData )

			} else if( type === SYSTEM ) {
				node.children = getSystemDependencies( metaData )

			} else if( type === COMPONENT ) {
				node.children = getComponentDependencies( metaData )

			} else if( type === SCRIPT ) {
				node.children = getScriptDependencies( metaData )

			} else if( type === ENTITY ) {
				//TODO: implement
				node.children = []

			} else if( type === ASSET ) {
				//TODO: implement
				node.children = []
			}

			if( scriptContent ) {
				node.children = node.children.concat( getModuleDependencies( scriptContent ) )
			}

			return node
		}
    }
)
