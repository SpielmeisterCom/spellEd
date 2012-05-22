Ext.define('Spelled.store.asset.Sounds', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Asset',

    filters: [
        function( item ) {
            return item.get('type') === 'sounds'
        }
    ]
});