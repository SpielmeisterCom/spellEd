Ext.define('Spelled.store.asset.Textures', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Asset',

    filters: [
        function( item ) {
            return item.get('type') === 'appearance'
        }
    ]
});