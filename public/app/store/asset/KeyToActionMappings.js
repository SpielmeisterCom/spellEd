Ext.define('Spelled.store.asset.KeyToActionMappings', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.KeyMapping'
	],

	model: 'Spelled.model.assets.KeyMapping'

})