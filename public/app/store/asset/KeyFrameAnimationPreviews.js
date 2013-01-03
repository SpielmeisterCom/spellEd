Ext.define('Spelled.store.asset.KeyFrameAnimationPreviews', {
	extend: 'Ext.data.Store',

	model: 'Spelled.model.Asset',

    filters: [
        function( item ) {
            return item.get('subtype') === 'animation' || item.get('subtype') === 'appearance'
        }
    ]
});