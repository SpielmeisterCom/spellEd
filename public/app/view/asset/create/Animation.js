Ext.define('Spelled.view.asset.create.Animation', {
    extend: 'Ext.container.Container',
    alias: 'widget.animationassetconfig',

	initComponent: function() {
		var me    = this,
			store = Ext.getStore( 'asset.SpriteSheets' )

		store.load()

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_2d_animated_appearance",
					width: 'null'
				},
				{
					xtype: "assetidproperty",
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
					xtype: "textfield",
					name: 'animationType',
					value: 'sprite',
					fieldLabel: 'Animation Type',
					readOnly: true
				},
				{
					xtype: "numberfield",
					name: 'duration',
					minValue: 0,
					fieldLabel: 'Duration'
				},
				{
					xtype: "textfield",
					name: 'frameIds',
					fieldLabel: 'Frames'
				}
			]
		})


		me.callParent()
	}
});
