Ext.define('Spelled.store.asset.Sounds', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.Sound'
	],

	model: 'Spelled.model.assets.Sound'

})