Ext.define('Spelled.store.asset.Textures', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('subtype') === 'appearance'
        }
    ]
});