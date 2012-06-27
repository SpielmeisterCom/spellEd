Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

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

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

    constructor: function() {
        this.callParent( arguments )
       	Ext.getStore( 'config.Components' ).add( this )
    },

    setChanged: function() {
        this.set( 'changed', true)
    },

	markChanges: function() {
		if( !Ext.isEmpty( this.get('config') ) ) this.setChanged()
	},

	getTemplate: function() {
		return Ext.getStore( 'template.Components').getByTemplateId( this.get('templateId') )
	},

	getTemplateConfig: function() {
		var templateComponent = this.getTemplate(),
			templateConfig    = templateComponent.getConfig()

		var config = {}
		Ext.Object.each(
			templateConfig,
			function( key, value ) {
				config[ key ] = value.get('default')
			}
		)

		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) ) ) {
			var templateEntity          = Ext.getStore( 'template.Entities').getByTemplateId( this.getEntity().get('templateId' )),
				templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

			if( templateEntityComponent ) {
				config = Ext.Object.merge( config, templateEntityComponent.get('config') )
			}
		}

		return config
	},

    getConfigMergedWithTemplateConfig: function( ) {
        //TODO: the config from entities get overwritten if we do not mark them
        this.markChanges()

		//Only merge with enityconfig, if it is really linked to a entity
		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) ) ) {
			var templateEntity          = Ext.getStore( 'template.Entities').getByTemplateId( this.getEntity().get('templateId' )),
				templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

			if( !templateEntityComponent ) {
				this.set('additional', true)
			}

		} else {
			this.set('additional', true)
		}

		var tmp = Ext.Object.merge( this.getTemplateConfig(), this.get('config') )

		//TODO: Warum ist trim in der config durch den merge
        delete tmp.trim

        return tmp
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});
