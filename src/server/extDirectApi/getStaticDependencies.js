define(
	'server/extDirectApi/getStaticDependencies',
	[
		'fs',
		'path',

		'underscore'
	],
	function(
		fs,
		path,

		_
	) {
		'use strict'

		var SCENE = 'scene'
		var SYSTEM = 'system'

		var libraryIdToFilePath = function( projectsRoot, projectName, libraryId ) {
			return path.join( projectsRoot, projectName, "library", libraryId.replace( /\./g, path.sep ) + '.json' )
		}

		var createDependencyNode = function( id, type ) {

			return { id: id, libraryId: id, type: type, isStatic: true }
		}

		var getComponentDependencies = function( component ) {


			return []
		}

		var getEntityDependencies = function( entity ) {
			var result = {}
//
//			if( _.has( entity.entityTemplateId) ) {
//				result.libraryId = entity.entityTemplateId
//			}
//
//			var children = _.map(
//				entity.children,
//				getEntityDependencies
//			)
//
//			_.each(
//				entity.config,
//				function( value, key ) {
//					var component = { libraryId: key }
//
//					component.children = _.map(
//						value,
//						getComponentDependencies
//					)
//
//					children.push( component )
//				}
//			)
//
//			result.children = children

			return result
		}

		var getSystemDependencies = function( system ) {

		}

		var getSceneDependencies = function( libraryId, scene ) {
			var children = [],
				node     = createDependencyNode( libraryId, scene )

			_.each(
				scene.systems,
				function( value ) {
					_.each(
						value,
						function( system ) {
							var node = createDependencyNode( system.id, SYSTEM )
							children.push( node )
						}
					)
				}
			)

			_.each(
				scene.entities,
				function( element ) {

				}
			)

			node.children = children

			return node
		}

		var getSystemDependencies = function( libraryId, system ) {
			var children = [],
				node     = createDependencyNode( libraryId, system )



			return node
		}

		return function( projectsRoot, projectName, libraryId ) {
			var filePath  = libraryIdToFilePath( projectsRoot, projectName, libraryId )
console.log( filePath )
			if( !fs.existsSync( filePath ) ) return

			var metaData = JSON.parse( fs.readFileSync( filePath, 'utf8' ) ),
				type     = metaData.type

			if( type === SCENE ) {
				return getSceneDependencies( libraryId, metaData )

			} else if( type === SYSTEM ) {
				return getSceneDependencies( libraryId, metaData )

			}

		}
    }
)
