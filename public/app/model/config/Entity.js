Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        'name'
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.config.Zone',
    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    getComponentByBlueprintId: function( blueprintId ) {
        var result = undefined
        Ext.each(
            this.getComponents().data.items,
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

        Ext.each(
            blueprintComponents.data.items,
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
        Ext.each( components.data.items, function( component ){
            result.components.push( component.getJSONConfig() )
        })

        return result
    }
});