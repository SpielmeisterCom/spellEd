Ext.define('Spelled.store.blueprint.Components', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.Component',

    proxy: {
        type: 'memory'
    },

    getByBlueprintId: function( blueprintId ) {
        var index = this.findBy( function( record ) {
            return ( record.getFullName() === blueprintId )
        })

        if( index > -1 ) {
            return this.getAt( index )
        }
    }
});