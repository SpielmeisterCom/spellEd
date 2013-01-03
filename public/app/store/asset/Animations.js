Ext.define('Spelled.store.asset.Animations', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.Animation'
	],

	model: 'Spelled.model.assets.Animation'

})