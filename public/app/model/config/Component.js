Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        { name: 'config', type: 'object', defaultValue: {} },
        { name: 'changed', type: 'boolean', defaultValue: false }
    ],

    idgen: 'uuid',

	associations: [
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity',
			setterName: 'setEntity'
		}
	],

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Components' ).add( this )
    },

    setChanged: function() {
        this.set( 'changed', true)
    },

	markChanges: function() {
		if( !Ext.isEmpty( this.get('config') ) ) this.setChanged()
	},

    getConfigMergedWithBlueprintConfig: function( ) {
        var blueprintComponent = Ext.getStore( 'blueprint.Components').getByBlueprintId( this.get('blueprintId')),
			blueprintConfig    = blueprintComponent.getConfig()

        //TODO: the config from entities get overwritten if we do not mark them
        this.markChanges()

		var tmp = {}
		//Only merge with enityconfig, if it is really linked to a entity
		if( this.hasOwnProperty( 'Spelled.model.config.EntityBelongsToInstance' ) ) {
			var blueprintEntity          = Ext.getStore( 'blueprint.Entities').getByBlueprintId( this.getEntity().get('blueprintId' )),
				blueprintEntityComponent = blueprintEntity.getComponents().findRecord( 'blueprintId', this.get('blueprintId') )

			tmp = Ext.Object.merge( blueprintConfig, blueprintEntityComponent.get('config'), this.get('config') )
		} else {
			tmp = Ext.Object.merge( blueprintConfig, this.get('config') )
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