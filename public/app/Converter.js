Ext.define( 'Spelled.Converter' ,{
	singleton: true,

	internalAssetIdToMyAssetId: function( internalAssetId ) {
		if( Ext.isString( internalAssetId ) ){
			var parts = internalAssetId.split( ':' )

			if( Ext.isArray( parts ) && parts.length > 1 ) {
				return parts.pop()
			}
		}

		return false
	},

	convertValueForGrid: function( value ) {
		if( Ext.isArray( value ) === true ) {
			return "[" + value.toString() + "]"
		} else if( Ext.isObject( value ) ) {
			return Ext.encode( value )
		} else {
			return value
		}
	},

	namespaceFromObject: function( object ) {
		var namespace = object.namespace,
			name      = object.name

		return ( !!namespace && namespace.length > 0 ) ? namespace +"."+ name : name
	},

	addAdditionalInfoToDependencyNode: function( node, static ) {
		var allLibraryIds = Ext.create( 'Ext.data.Store', {
			fields: [ 'id', 'libraryId', 'type', 'sortOrder' ],
			data: Ext.getStore( 'Library' ).getAllLibraryIds()
			})

		var mergeChildren = function( targetChild, sourceChild ) {
			var targetChildren = targetChild.children,
				sourceChildren = sourceChild.children

			for ( var u = 0, i = sourceChildren.length; u < i; u++ ) {
				var item                 = sourceChildren[ u ],
					entityChildLibraryId = item.libraryId,
					exists               = false

				for ( var j = 0, l = targetChildren.length; j < l; j++ ) {
					var sourceItem = targetChildren[ j ]

					if( sourceItem.libraryId == entityChildLibraryId && sourceItem.children.length == 0 ) {
						exists = sourceItem
						break
					}
				}

				if( !exists ) {
					targetChildren.push( item )
				}
			}
		}

		var addInfo = function( childNode ) {
			var found       = allLibraryIds.findRecord( 'libraryId', childNode.libraryId ),
				children    = childNode.children,
				tmp         = {},
				newChildren = []

			if( found ) childNode.iconCls = childNode.iconCls || found.get( 'type' )

			for ( var j = 0, l = children.length; j < l; j++ ) {
				var child         = children[ j ],
					libraryId     = child.libraryId,
					existingChild = tmp[ libraryId ]

				if( !existingChild ) {
					tmp[ libraryId ] = child
					newChildren.push( child )
				} else {
					//Only for entities

					mergeChildren( existingChild, child )
					addInfo( existingChild )
				}

				addInfo( child )
			}

			childNode.children = newChildren
		}

		addInfo( node )
	},

	integerListFromString: function( list ) {
		var values = list.split( "," )
		return Ext.Array.map( values, function( item ) { return parseInt( item, 10 ) } )
	},

	decodeFieldValue: function( value, type ) {
		if( type && type === 'string' ) return value

		return Ext.decode( value, true ) || value
	},

	formatPropertyGridSource: function( source ) {
		var newSource = {}
		Ext.Object.each( source,
			function( key, attribute ) {
				newSource[ key ] = attribute.value
			},
			this
		)

		return newSource
	}
})
