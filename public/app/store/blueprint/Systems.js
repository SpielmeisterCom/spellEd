Ext.define('Spelled.store.blueprint.Systems', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.System',

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