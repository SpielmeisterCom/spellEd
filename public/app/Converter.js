Ext.define( 'Spelled.Converter' ,{
	singleton: true,

	getLicenseExpireDate: function( start, days ) {
		return Ext.Date.add( new Date( start ), Ext.Date.DAY, days )
	},

	libraryIdToRelativePath: function( libraryId ) {
		return libraryId.replace( /\./g, "/" )
	},

	getLocalizedFilePath: function( filePath, extension, language ) {
		var parts = filePath.split( '.' )

		if( extension ) parts.pop()

		parts.push( this.localizeExtension( language, extension ) )

		return parts.join( '.' )
	},

	generateCacheContent: function( item ) {
		var content = []

		var filePath = this.libraryIdToRelativePath( item.getFullName() )

		if( item.toSpellEngineMessageFormat ) {
			content.push( { content: item.toSpellEngineMessageFormat(), filePath: filePath + ".json" } )
		}

		if( item.get( 'content' ) ) {
			content.push( { content: item.get( 'content' ), filePath: filePath + ".js" } )
		}

		return content
	},

	localizeExtension: function( language, extension ) {
		if( language == 'default' ) language = ''

		return Ext.Array.clean( [ language , extension ] ).join( '.' )
	},

	toWorkspaceUrl: function( url ) {
		var workspacePath = Spelled.Configuration.getWorkspacePath(),
			url           = ( workspacePath && workspacePath.length > 0 ) ? workspacePath + '/' + url : url

		return Spelled.app.platform.normalizeUrl( url )
	},

	internalAssetIdToMyAssetId: function( internalAssetId ) {
		if( Ext.isString( internalAssetId ) ){
			var parts = internalAssetId.split( ':' )

			if( Ext.isArray( parts ) && parts.length > 1 ) {
				return parts.pop()
			} else {
				return internalAssetId
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
