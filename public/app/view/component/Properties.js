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

		var storeId = 'asset.Assets'

		if( !!this.source.assetId ) {
			switch( this.getAssetIdType( this.source.assetId ) ) {
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
			}
		}

		me.customEditors = {
			assetId:  new Ext.grid.CellEditor({
				field: {
					xtype: 'assetidproperty',
					store: storeId
				}
			})
		}

		if( this.isAdditional === true ) this.closable = true

		this.callParent( arguments )
	},

	getAssetIdType: function( assetId ) {
		return assetId.split( ':').shift()
	}
});