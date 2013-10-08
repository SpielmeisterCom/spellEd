Ext.define( 'Spelled.EntityHelper', {
	singleton: true,

	getEntitesByTemplateId: function( templateId ) {
		return Ext.getStore( 'config.Entities' ).query( 'templateId', templateId )
	},

	hasOwnerAnChildWithThisName: function( owner, name ) {
		var entities = ( owner.self.getName() == Spelled.model.config.Scene.getName() ) ? owner.getEntities() : owner.getChildren(),
			child    = entities.findRecord( 'name', name, null, null, null, true )

		return child
	},

	missingTemplateError: function( model ) {
		var text = 'The Template "' + model.get('templateId') + '" could not be found.'

		Ext.Msg.confirm(
			'Error', text + 'Should the reference to this template be removed?',
			function( button ) {
				if( button === "yes" ) {
					model.set( 'templateId', '' )
					model.setDirty()
				}
			}
		)

		Spelled.Logger.log( 'ERROR', text )
	},

	getRootTemplateEntityFromEntity: function( entity ) {
		if( entity.hasOwnerEntity && entity.hasOwnerEntity() ) {
			return entity.getOwnerEntity()

		} else if( entity.hasEntity && entity.hasEntity() ) {
			return this.getRootTemplateEntityFromEntity( entity.getEntity() )

		} else if( entity.get( 'type' ) === 'entityTemplate' ) {
			return Ext.getStore( 'template.Entities' ).getByTemplateId( entity.get( 'templateId' ) )
		}

		return false
	},

	getRootTemplateOwnerFromComponent: function( component ) {
		return this.getRootTemplateEntityFromEntity( component.getEntity() )
	},

	getRootEntityOwnerFromEntity: function( entity, parents ) {
		var name = entity.get( 'name' )

		if( !entity.hasEntity ) return false

		parents.unshift( name )
		return ( entity.hasEntity() ) ? this.getRootEntityOwnerFromEntity( entity.getEntity(), parents ) : entity
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
	},

	getNextEntityBasedTemplate: function( entity, parents ) {

		if( !entity.isAnonymous() ) {
			return entity

		} else if( entity.hasEntity() ) {
			parents.push( entity.get( 'name' ) )
			return this.getNextEntityBasedTemplate( entity.getEntity(), parents )
		}
	},

	findCompositeEntity: function( component ) {

		var recursion = function( entity, parents ) {
			var entityBasedTemplate = Spelled.EntityHelper.getNextEntityBasedTemplate( entity, parents )

			if( entityBasedTemplate ) {
				var template    = entityBasedTemplate.getEntityTemplate(),
					copyParents = Ext.Array.clone( parents ),
					found       = Spelled.EntityHelper.findNeededEntity( template, parents )

				if( found ) {
					return found

				} else if( entity.hasEntity() ) {
					return recursion( entity.getEntity(), copyParents )
				}
			}
		}

		return recursion( component.getEntity(), [] )
	}
})
