Ext.define('Spelled.store.asset.Sounds', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('type') === 'sound'
        }
    ]
});