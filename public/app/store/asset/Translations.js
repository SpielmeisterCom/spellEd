Ext.define('Spelled.store.asset.Translations', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.Translation'
	],

	model: 'Spelled.model.assets.Translation'

})