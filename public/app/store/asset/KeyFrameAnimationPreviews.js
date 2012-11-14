Ext.define('Spelled.store.asset.KeyFrameAnimationPreviews', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('subtype') === 'animation' || item.get('subtype') === 'appearance'
        }
    ]
});