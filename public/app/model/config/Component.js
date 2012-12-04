Ext.define('Spelled.model.config.Component', {
	extend: 'Ext.data.Model',

	requires: [
		'idgen.uuid',
		'association.belongsto'
	],

	fields: [
        'templateId',
        { name: 'config', type: 'object', defaultValue: {} },
        { name: 'changed', type: 'boolean', defaultValue: false },
		{ name: 'additional', type: 'boolean', defaultValue: true }
    ],

    idgen: 'uuid',

	associations: [
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity'
		}
	],

	stripRedundantData: function() {
		var config  = this.get( 'config' )

		Ext.Object.each(
			Ext.Object.merge( {}, this.getComponentTemplateConfig(), this.getTemplateConfig() ),
			function( key, value ) {
				//TODO: strip engine internals?
				if( Spelled.Compare.isEqual( value, config[ key ] ) ) {
					delete config[ key ]
				}
			}
		)
	},

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

    constructor: function() {
        this.callParent( arguments )
       	Ext.getStore( 'config.Components' ).add( this )
    },

    setChanged: function() {
        this.set( 'changed', true)
		this.dirty = true
		this.getEntity().setDirty()
    },

	unDirty: function() {
		this.dirty = false
		this.changed = false
	},

	markChanges: function() {
		this.stripRedundantData()
		if( !Ext.isEmpty( this.get('config') ) ) this.set( 'changed', true)
	},

	getTemplate: function() {
		var template = Ext.getStore( 'template.Components' ).getByTemplateId( this.get( 'templateId' ) )

		if( !template ) {
			throw 'Error: Could not resolve template id \'' + this.get( 'templateId' ) + '\' to template.'
		}

		return template
	},

	getComponentTemplateConfig: function() {
		var templateComponent = this.getTemplate(),
			templateConfig    = templateComponent.getConfig()

		var config = {}
		Ext.Object.each(
			templateConfig,
			function( key, value ) {
				config[ key ] = Ext.clone( value.get('default') )
			}
		)

		return config
	},

	getTemplateConfig: function() {
		var config = {}

		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) )  ) {
			var templateEntity = Ext.getStore( 'template.Entities' ).getById( this.getEntity().get('templateId' ) )

			if( templateEntity ){
				var templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

				if( templateEntityComponent ) {
					config = Ext.Object.merge( config, templateEntityComponent.get('config') )
					this.set( 'additional', false )
				}
			}
		} else {
			config = Ext.Object.merge( config, this.getTemplateCompositeConfig() )
		}

		return config
	},

	getTemplateCompositeConfig: function() {
		var componentEntity = this.getEntity(),
			parents         = [],
			config          = {}

		if( !componentEntity.hasEntity || !componentEntity.hasEntity() ) return {}

		var owner         = componentEntity.getOwner(),
			ownerIsEntity = !!owner.hasEntity

		if( owner.isAnonymous && owner.isAnonymous() && owner.removable === true ) return {}

		var getTemplate = function( entity ) {
			var template = ( !entity.isAnonymous()  ) ? entity.getEntityTemplate() : undefined

			if( template || !entity.hasEntity()  ) {
				parents.push( componentEntity.get('name') )
				return template
			} else {
				parents.push( entity.get( 'name' ) )
				return getTemplate( entity.getEntity() )
			}
		}

		var	template = ( ownerIsEntity ) ? getTemplate( owner ) : owner

		if( !template ) return {}

		var findNeededEntity = function( source, parents ) {

			if( parents.length === 0 ) return source
			var name = parents.shift()

			var child = source.getChildren().findRecord( 'name', name )

			if( child ) {
				return findNeededEntity( child, parents )
			} else {
				return undefined
			}
		}

		var entity = findNeededEntity( template, parents )

		if( !entity ) return {}

		var	templateComponents = entity.getComponents(),
			component          = undefined

		templateComponents.each(
			function( templateComponent ) {
				if( templateComponent.get('templateId') === this.get( 'templateId' ) ) {
					component = templateComponent
					return false
				}
			},
			this
		)

		if( component ) {
			config = Ext.Object.merge( config, component.get( 'config' ) )
			this.set( 'additional', false )
		}
		return config
	},

    getConfigMergedWithTemplateConfig: function( ) {
		var config = {}

		config = Ext.Object.merge( config, this.getComponentTemplateConfig(), this.getTemplateConfig(), this.get('config') )

		//TODO: Warum ist trim in der config durch den merge
        delete config.trim

        return config
    }
});
