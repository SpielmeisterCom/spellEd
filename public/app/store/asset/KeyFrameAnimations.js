Ext.define('Spelled.store.asset.KeyFrameAnimations', {
    extend: 'Spelled.store.asset.Assets',

    filters: [
        function( item ) {
            return item.get('subtype') === 'keyFrameAnimation'
        }
    ]
});