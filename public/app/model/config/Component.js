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
        var blueprintComponent       = Ext.getStore( 'blueprint.Components').getByBlueprintId( this.get('blueprintId')),
			blueprintEntity          = Ext.getStore( 'blueprint.Entities').getByBlueprintId( this.getEntity().get('blueprintId' )),
			blueprintEntityComponent = blueprintEntity.getComponents().findRecord( 'blueprintId', this.get('blueprintId') )

        var blueprintConfig =  {}
        blueprintComponent.getAttributes().each(
            function( attribute ) {
                blueprintConfig[ attribute.get('name') ] = attribute
            }
        )

        //TODO: the config from entities get overwritten if we do not mark them
        this.markChanges()

        var tmp = Ext.Object.merge( blueprintConfig, blueprintEntityComponent.get('config'), this.get('config') )

        //TODO: Warum ist trim in der config durch den merge
        delete tmp.trim

        return tmp
    },

    getJSONConfig: function() {

        var result = this.data

        return result
    }
});