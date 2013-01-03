Ext.define('Spelled.store.asset.Appearances', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.Appearance'
	],

	model: 'Spelled.model.assets.Appearance'

})