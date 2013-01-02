Ext.define('Spelled.model.assets.KeyFrameAnimation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_key_frame_animation',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'keyFrameAnimation'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'asset'
		}
	},

	fields: [
		'file'
	],

	getKeyFrameFromComponentAttribute: function( componentId, attributeName ) {
		var config = this.get( 'config')

		if( config.animate[ componentId ] && config.animate[ componentId ][ attributeName ] )
			return config.animate[ componentId ][ attributeName ].keyFrames
		else
			return []
	}
})