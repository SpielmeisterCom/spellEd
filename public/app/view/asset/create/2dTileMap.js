Ext.define('Spelled.view.asset.create.2dTileMap', {
	extend: 'Ext.container.Container',
	alias: 'widget.2dtilemapconfig',

	initComponent: function() {
		var me    = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_2d_tilemap",
					width: 'null'
				},
				{
					xtype: "assetidproperty",
					name: 'tileMapAssetId',
					store: 'asset.SpriteSheets',
					allowBlank: true,
					fieldLabel: "From existing Sprite Sheet"
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Width',
					name: 'width'
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Height',
					name: 'height'
				}, {
					name: 'tilemapeditoriframe',
					xtype: 'tilemapeditoriframe'
				}
			]
		})

		me.callParent()
	}
});

