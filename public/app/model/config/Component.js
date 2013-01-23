Ext.define('Spelled.model.config.Component', {
	extend: 'Ext.data.Model',

	requires: [
		'idgen.uuid',
		'association.belongsto',
		'Spelled.EntityHelper'
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
			model: 'Spelled.model.config.Entity'
		}
	],

	getCalculatedDependencies: function() {
		var ids     = [],
			library = Ext.getStore( 'Library'),
			getter  = Spelled.Converter.internalAssetIdToMyAssetId

		Ext.Object.each(
			this.getConfigMergedWithTemplateConfig(),
			function( key, value ) {
				if( key === "assetId" && value ) {
					var myAssetId   = getter( value ),
						libraryItem = library.findLibraryItemByLibraryId( myAssetId )

					if( libraryItem ) Ext.Array.push( ids, libraryItem.getCalculatedDependencies() )
				}
			}
		)

		return Ext.Array.clean( ids )
	},

	getAttributeByName: function( name ) {
		return this.getTemplate().getAttributeByName( name )
	},

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

		var componentTemplateConfig = this.getComponentTemplateConfig()
		Ext.Object.each(
			config,
			function( key ) {
				if( !componentTemplateConfig.hasOwnProperty( key ) ) delete config[ key ]
			}
		)
	},

	getEntity: function() {
		var tmp = null

		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) ) {
			tmp = this[ 'Spelled.model.config.EntityBelongsToInstance' ]

		} else if( this.data[ 'spelled.model.config.entity_id' ] ){
			tmp = Ext.getStore( 'config.Entities' ).getById( this.data[ 'spelled.model.config.entity_id' ] )

		} else {
			tmp =  Ext.getStore( 'template.Entities' ).getById( this.get( 'spelled.model.template.entity_id' ) )
		}

		return tmp
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

		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && this.getEntity().isRemovable && !Ext.isEmpty( this.getEntity().get('templateId' ) )  ) {
			var templateEntity = Ext.getStore( 'template.Entities' ).getByTemplateId( this.getEntity().get('templateId' ) )

			if( templateEntity ){
				var templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

				if( templateEntityComponent ) {
					config = Ext.Object.merge( config, templateEntityComponent.get('config') )
					this.set( 'additional', false )
				}
			}
		}

		config = Ext.Object.merge( config, this.getTemplateCompositeConfig() )

		return config
	},

	getTemplateCompositeConfig: function() {
		var componentEntity = this.getEntity(),
			parents         = [],
			config          = {}

		if( !componentEntity || !componentEntity.hasEntity || !componentEntity.hasEntity() ) return {}

		var owner         = componentEntity.getOwner(),
			ownerIsEntity = !!owner.hasEntity

		if( owner.isAnonymous && owner.isAnonymous() && owner.removable === true ) return {}

		var	rootOwner = ( ownerIsEntity ) ? Spelled.EntityHelper.getRootOwnerFromChildren( componentEntity.get( 'name' ), owner, parents ) : owner

		if( !rootOwner ) return {}

		var template = Ext.getStore( 'template.Entities' ).getByTemplateId( rootOwner.get('templateId') ),
			entity   = Spelled.EntityHelper.findNeededEntity( template, parents )

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
