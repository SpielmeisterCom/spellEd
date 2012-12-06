Ext.define( 'Spelled.EntityHelper', {
	singleton: true,

	getRootEntityFromEntity: function( entity ) {
		if( entity.hasOwnerEntity && entity.hasOwnerEntity() ) return entity.getOwnerEntity()
		else if( entity.hasEntity && entity.hasEntity() ) return this.getRootEntityFromEntity( entity.getEntity() )
		else if( entity.get( 'type' ) === "entityTemplate" ) {
			return Ext.getStore( 'template.Entities' ).getByTemplateId( entity.get( 'templateId' ) )
		}

		return false
	},

	getRootOwnerFromComponent: function( component ) {
		return this.getRootEntityFromEntity( component.getEntity() )
	},

	findNeededEntity: function( source, parents ) {
		if( !source ) return undefined

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
		if( !entity.isAnonymous ) return false

		if( !entity.isAnonymous() || !entity.hasEntity()  ) {
			parents.push( name )
			return entity
		} else {
			parents.push( entity.get( 'name' ) )
			return this.getRootOwnerFromChildren( name, entity.getEntity(), parents )
		}
	}
})
