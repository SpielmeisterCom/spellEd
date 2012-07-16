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
			type:'help',
			tooltip: 'Get Help',
			handler:  Ext.bind( me.handleDocClick, me)
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
	},

	handleDocClick: function( event, toolEl, panel ) {
		this.fireEvent( 'showDocumentation', event, toolEl, panel );
	}
});