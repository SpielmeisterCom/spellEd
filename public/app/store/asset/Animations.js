Ext.define('Spelled.store.asset.Animations', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('subtype') === 'animation'
        }
    ]
});