Ext.define('Spelled.store.asset.KeyToActionMappings', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('subtype') === 'keyToActionMap'
        }
    ]
});