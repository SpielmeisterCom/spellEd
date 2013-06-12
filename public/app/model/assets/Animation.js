Ext.define('Spelled.model.assets.Animation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_2d_animated_appearance',

	iconCls: "tree-asset-2danimation-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'animation'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'animation' },
		{ name: 'assetId', type: 'string' },
		{ name: 'duration', type: 'float' },
		{ name: 'frameIds', type: 'array'},
		{ name: 'rotation', type: 'float' },
		{ name: 'transformation', type: 'array' },
		{ name: 'scale', type: 'array' }
	]
})