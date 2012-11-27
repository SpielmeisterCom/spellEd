Ext.define('Spelled.view.asset.create.2dTileMap', {
	extend: 'Ext.container.Container',
	alias: 'widget.2dtilemapconfig',

	mixins: [ 'Spelled.abstract.field.AssetId' ],

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
					xtype: 'fieldcontainer',
					fieldLabel: "From existing Sprite Sheet",
					layout: 'column',
					items: [
						{
							xtype: "assetidproperty",
							name : 'tileMapAssetId',
							allowBlank: true,
							store: 'asset.SpriteSheets'
						},
						{
							hidden: !this.edit,
							padding: 5,
							xtype: "tool",
							type: 'search',
							handler: Ext.bind( me.clickedDeepLink, me )
						}
					]
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

