Ext.define( 'Spelled.EntityHelper', {
	singleton: true,

	findNeededEntity: function( source, parents ) {
		if( parents.length === 0 ) return source
		var name = parents.shift()

		var child = source.getChildren().findRecord( 'name', name )

		if( child ) {
			return this.findNeededEntity( child, parents )
		} else {
			return undefined
		}
	},

	getRootOwnerFromChildren: function( name, entity, parents ) {
		var template = ( !entity.isAnonymous()  ) ? entity : undefined

		if( template || !entity.hasEntity()  ) {
			parents.push( name )
			return template
		} else {
			parents.push( entity.get( 'name' ) )
			return this.getRootOwnerFromChildren( name, entity.getEntity(), parents )
		}
	}
})
