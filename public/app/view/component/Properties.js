Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

	margin: '0 0 5 0',
	collapsible: true,
	titleCollapse: true,

	hideHeaders: true,
	deferRowRender: false,

	initComponent: function() {
		var me = this

		me.tools = [{
			xtype: 'tool-documentation'
		}]

		this.customEditors = {}
		Ext.Object.each( this.source,
			this.addCustomEditor,
			this
		)

		this.formatSource()

		if( this.isAdditional === true ) this.closable = true

		this.callParent()
	},

	formatSource: function() {
		var newSource = {}
		Ext.Object.each( this.source,
			function( key, attribute ) {
				newSource[ key ] = attribute.value
			},
			this
		)

		this.source = newSource
	},

	addCustomEditor: function( key, attribute ) {
		var value = attribute.value,
			type  = attribute.type,
			cellEditorConfig = { field: { xtype: type, value: value, initialValue: attribute.initialValue } }

		if( key === 'assetId' ) {
			var storeId = 'asset.Assets'

			if( !!value ) {
				switch( this.getAssetIdType( value ) ) {
					case 'appearance':
						storeId = 'asset.Textures'
						break
					case 'animation':
						storeId = 'asset.Animations'
						break
					case 'spriteSheet':
						storeId = 'asset.SpriteSheet'
						break
					case 'font':
						storeId = 'asset.Fonts'
						break
					case 'sound':
						storeId = 'asset.Sounds'
						break
					case 'keyToActionMap':
						storeId = 'asset.KeyToActionMappings'
						break
				}
			}

			cellEditorConfig.field.store = storeId
		}

		this.customEditors[ key ] = new Ext.grid.CellEditor( cellEditorConfig )
	},

	getAssetIdType: function( assetId ) {
		return assetId.split( ':').shift()
	}
});