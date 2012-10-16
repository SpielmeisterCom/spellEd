Ext.define('Spelled.view.asset.create.2dTileMap', {
	extend: 'Ext.container.Container',
	alias: 'widget.2dtilemapconfig',

	initComponent: function() {
		var me    = this,
			store = Ext.getStore( 'asset.SpriteSheets' )

		store.load()

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
					queryMode: 'remote',
					store: store,
					allowBlank: true,
					fieldLabel: "From existing Sprite Sheet",
					listeners: {
						'change': function( cmp, value) {
							if( value )
								this.up('form').down('filefield').reset()
						}
					},
					validator: function( value ) {
						if( !this.isVisible( true ) ) return true

						var file = this.up('form').down('filefield').getValue()
						if( ( !file && !value ) )
							return "You need to select a existing Asset"
						else
							return true
					}
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

