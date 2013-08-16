Ext.define('Spelled.model.assets.Appearance', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_2d_static_appearance',

	iconCls: "tree-asset-2dstaticappearance-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'appearance'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'localized', type: 'boolean', defaultValue: false },
		'localization',
		'extension',
		{ name: 'subtype', type: 'string', defaultValue: 'appearance' }
	],

	getFile: function() {
		var extension = this.get( 'extension' ),
			parts     = [ this.getFullName(), extension ]

		return parts.join( '.' )
	},

	setFile: function( filePath ) {
		this.set( 'extension', filePath.split( '.' ).pop() )
	},

	destroy: function() {
		var localizations = this.get( 'localization' )

		if( Ext.isObject( localizations ) ) {
			Ext.Object.each(
				localizations,
				this.removeLocalizedResource,
				this
			)
		}

		this.callParent( arguments )
	}
})