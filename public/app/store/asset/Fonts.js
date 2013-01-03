Ext.define('Spelled.store.asset.Fonts', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.Font'
	],

	model: 'Spelled.model.assets.Font'
});