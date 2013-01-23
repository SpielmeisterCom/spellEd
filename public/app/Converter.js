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

	libraryIdsToModels: function( libraryIds ) {
		var result        = [],
			allLibraryIds = Ext.create( 'Ext.data.Store', {
			fields: [ 'id', 'libraryId', 'type', 'sortOrder' ],
			data: Ext.getStore( 'Library' ).getAllLibraryIds()
		})

		Ext.Array.each(
			libraryIds,
			function( item ) {
				var found = allLibraryIds.findRecord( 'libraryId', item )

				if( found ) result.push( found )
			}
		)

		return result
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
