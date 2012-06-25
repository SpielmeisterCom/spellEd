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

    getConfigMergedWithTemplateConfig: function( ) {
        var templateComponent = Ext.getStore( 'template.Components').getByTemplateId( this.get('templateId')),
			templateConfig    = templateComponent.getConfig()

        //TODO: the config from entities get overwritten if we do not mark them
        this.markChanges()

		var tmp = {}
		//Only merge with enityconfig, if it is really linked to a entity
		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) && !Ext.isEmpty( this.getEntity().get('templateId' ) ) ) {
			var templateEntity          = Ext.getStore( 'template.Entities').getByTemplateId( this.getEntity().get('templateId' )),
				templateEntityComponent = templateEntity.getComponents().findRecord( 'templateId', this.get('templateId') )

			if( !templateEntityComponent ) {
				this.set('additional', true)
				tmp = Ext.Object.merge( templateConfig, this.get('config') )
			} else {
				tmp = Ext.Object.merge( templateConfig, templateEntityComponent.get('config'), this.get('config') )
			}

		} else {
			this.set('additional', true)
			tmp = Ext.Object.merge( templateConfig, this.get('config') )
		}

        //TODO: Warum ist trim in der config durch den merge
        delete tmp.trim

        return tmp
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});
