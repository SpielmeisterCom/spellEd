Ext.define('Spelled.view.asset.create.Animation', {
    extend: 'Ext.container.Container',
    alias: 'widget.animationassetconfig',

	initComponent: function() {
		var me    = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_2d_animated_appearance",
					width: 'null'
				},
				{
					xtype: "assetidproperty",
					store: 'asset.SpriteSheets',
					fieldLabel: "From existing Sprite Sheet"
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
