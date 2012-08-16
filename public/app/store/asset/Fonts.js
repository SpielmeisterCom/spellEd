Ext.define('Spelled.store.asset.Fonts', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('type') === 'font'
        }
    ]
});