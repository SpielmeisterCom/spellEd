Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        'name'
    ],

    idgen: 'uuid',

	associations: [{
		model:"Spelled.model.config.Zone",
		type:"belongsTo",
		getterName: 'getZone',
		setterName: 'setZone'
	}],

    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    getComponentByBlueprintId: function( blueprintId ) {
        var result = undefined
        this.getComponents().each(
            function( component ) {
                if( component.get('blueprintId') === blueprintId ) {
                    result = component
                    return false
                }
            }
        )

        return result
    },

    mergeWithBlueprintConfig: function() {
        var entityBlueprint     = Ext.getStore( 'blueprint.Entities' ).getByBlueprintId( this.get('blueprintId')),
            blueprintComponents = entityBlueprint.getComponents(),
            components          = this.getComponents()

        blueprintComponents.each(
            function( blueprintComponent ) {
                var component = this.getComponentByBlueprintId( blueprintComponent.get('blueprintId') )

                if( !component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        blueprintId: blueprintComponent.get('blueprintId'),
                        config: blueprintComponent.get('config')
                    })

                    components.add(
                        newComponent
                    )
                }
            },
            this
        )
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Entities' ).add( this )
    },

    getJSONConfig: function() {

        var result = this.data
        var components = this.getComponents()

        result.components = []
        components.each( function( component ){
            result.components.push( component.getJSONConfig() )
        })

        return result
    }
});