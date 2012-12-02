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
		{ name: 'additional', type: 'boolean', defaultValue: false }
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
			Ext.Object.merge( this.getTemplateConfig(true), this.getTemplateCompositeConfig() ),
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
		if( !Ext.isEmpty( this.get('config') ) ) this.set( 'changed', true)
	},

	getTemplate: function() {
		var template = Ext.getStore( 'template.Components' ).getByTemplateId( this.get( 'templateId' ) )

		if( !template ) {
			throw 'Error: Could not resolve template id \'' + this.get( 'templateId' ) + '\' to template.'
		}

		return template
	},

	getTemplateConfig: function( noMerge ) {
		var templateComponent = this.getTemplate(),
			templateConfig    = templateComponent.getConfig()

		var config = {}
		Ext.Object.each(
			templateConfig,
			function( key, value ) {
				config[ key ] = Ext.clone( value.get('default') )
			}
		)

		if( !noMerge && this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) ) ) {
			var templateEntity          = Ext.getStore( 'template.Entities').getByTemplateId( this.getEntity().get('templateId' )),
				templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

			if( templateEntityComponent ) {
				config = Ext.Object.merge( config, templateEntityComponent.get('config') )
			}
		}

		return config
	},

	getTemplateCompositeConfig: function() {
		var componentEntity    = this.getEntity()

		if( !componentEntity.hasEntity || !componentEntity.hasEntity() ) return {}
		var owner = componentEntity.getOwner()
		if( owner.isAnonymous && owner.isAnonymous() ) return {}

		var	tmp    = ( owner.getEntityTemplate ) ? owner.getEntityTemplate() : owner,
			entity = tmp.getChildren().findRecord( 'name', componentEntity.get('name') )

		if( !entity ) return {}

		var	templateComponents = entity.getComponents(),
			component          = undefined

		templateComponents.each(
			function( templateComponent ) {
				if( templateComponent.get('templateId') === this.get( 'templateId' ) ) {
					component = templateComponent
					this.set( 'additional', false )
					return false
				}
			},
			this
		)

		return ( component ) ? component.get( 'config' ) : {}
	},

    getConfigMergedWithTemplateConfig: function( ) {
        this.markChanges()

		var config = {}

		//Only merge with enityconfig, if it is really linked to a entity
		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) ) ) {
			var templateId              = this.getEntity().get('templateId'),
				templateEntity          = Ext.getStore( 'template.Entities').getByTemplateId( templateId )

			if( !templateEntity ) {
				var message = "The entity template '" + templateId + "' could not be found. Cannot continue loading; please fix this problem manually."

				Ext.Msg.alert( 'Missing entity template', message )

				throw message
			}

			var	templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

			if( !templateEntityComponent || templateEntity.modelName === this.getEntity().modelName ) {
				this.set('additional', true)
			}

		} else {
			this.set('additional', true)
		}

		config = Ext.Object.merge( config, this.getTemplateConfig(), this.getTemplateCompositeConfig(), this.get('config') )

		//TODO: Warum ist trim in der config durch den merge
        delete config.trim

        return config
    }
});
