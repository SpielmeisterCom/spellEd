Ext.define('Spelled.store.asset.KeyFrameAnimations', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.KeyFrameAnimation'
	],

	model: 'Spelled.model.assets.KeyFrameAnimation'

})
