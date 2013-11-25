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
		var COMPONENT = 'component'
		var ASSET = 'asset'
		var ENTITY = 'entityTemplate'

		var libraryIdToFilePath = function( projectsRoot, projectName, libraryId ) {
			return path.join( projectsRoot, projectName, "library", libraryId.replace( /\./g, path.sep ) + '.json' )
		}

		var createDependencyNode = function( id, type ) {

			return { libraryId: id, id: id, type: type, isStatic: true }
		}

		var getComponentDependencies = function( libraryId, component ) {
			var children = [],
				node     = createDependencyNode( libraryId, COMPONENT )

			_.each(
				component.attributes,
				function( attribute ) {
					//TODO: parse template correctly and check vor assetIds etc.
//					if( attribute.type === 'assetId' ){
//						children.push( createDependencyNode( input.default, ASSET ) )
//					}
				}
			)

			node.children = children

			return node
		}

		var getEntityDependencies = function( libraryId, entity ) {
			var children = [],
				node     = createDependencyNode( libraryId, ENTITY )
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
			node.children = children

			return node
		}

		var getSystemDependencies = function( libraryId, system ) {
			var children = [],
				node     = createDependencyNode( libraryId, SYSTEM )

			_.each(
				system.input,
				function( input ) {
					children.push( createDependencyNode( input.componentId, COMPONENT ) )
				}
			)

			node.children = children

			return node
		}

		var getAssetDependencies = function( libraryId, asset ) {
			var children = [],
				node     = createDependencyNode( libraryId, ASSET )

			//TODO: parse asset json
			node.children = children

			return node
		}

		var getSceneDependencies = function( libraryId, scene ) {
			var children = [],
				node     = createDependencyNode( libraryId, SCENE )

			_.each(
				scene.systems,
				function( value ) {
					_.each(
						value,
						function( system ) {
							children.push( createDependencyNode( system.id, SYSTEM ) )
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

		var readMetaData = function( filePath ) {
			if( !fs.existsSync( filePath ) ) return null

			return JSON.parse( fs.readFileSync( filePath, 'utf8' ) )
		}

		return function( projectsRoot, projectName, libraryId ) {
			var filePath = libraryIdToFilePath( projectsRoot, projectName, libraryId ),
				metaData = readMetaData( filePath)

			if( !metaData ) return

			var type = metaData.type

			if( type === SCENE ) {
				return getSceneDependencies( libraryId, metaData )

			} else if( type === SYSTEM ) {
				return getSystemDependencies( libraryId, metaData )

			} else if( type === COMPONENT ) {
				return getComponentDependencies( libraryId, metaData )

			} else if( type === ENTITY ) {
				return getEntityDependencies( libraryId, metaData )

			} else if( type === ASSET ) {
				return getAssetDependencies( libraryId, metaData )
			}

		}
    }
)
