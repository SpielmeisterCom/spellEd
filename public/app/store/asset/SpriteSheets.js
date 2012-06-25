Ext.define('Spelled.store.asset.SpriteSheets', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('type') === 'spriteSheet'
        }
    ]
});