Ext.define('Spelled.model.assets.Sound', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sound',

	iconCls: "tree-asset-sound-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'sound'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'localized', type: 'boolean', defaultValue: false },
		{ name: 'subtype', type: 'string', defaultValue: 'sound' },
		'localization'
	],

	isSound: true,

	getFile: function() {
		return this.getFullName()
	},

	setFile: function() {},

	setLocalizedFileInfo: function(  extension, language ) {
		this.callParent( [ '', language ] )
	},

	removeResource: function() {
		var absFilePath = this.getAbsoluteFilePath(),
			parts       = absFilePath.split( '.' )

		parts.pop()

		var fileWithNoExt = parts.join( '.' )

		Spelled.StorageActions.destroy({ id: fileWithNoExt + ".mp3" } )
		Spelled.StorageActions.destroy({ id: fileWithNoExt + ".ogg" } )
	},

	removeLocalizedResource: function( language ) {
		Spelled.StorageActions.destroy({ id: Spelled.Converter.getLocalizedFilePath( this.getAbsoluteFilePath(), 'ogg', language ) } )
		Spelled.StorageActions.destroy({ id: Spelled.Converter.getLocalizedFilePath( this.getAbsoluteFilePath(), 'mp3', language ) } )
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