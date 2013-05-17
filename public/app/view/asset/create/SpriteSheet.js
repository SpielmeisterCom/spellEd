Ext.define('Spelled.view.asset.create.SpriteSheet', {
    extend: 'Ext.container.Container',
    alias: 'widget.spritesheetconfig',

	padding: 5,

	initComponent: function() {
	    var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_sprite_sheet",
					width: 'null'
				},
				{
					xtype: 'assetfilefield', needValidation: !this.edit
				},
				{
					xtype: "numberfield",
					name: 'textureWidth',
					minValue: 0,
					fieldLabel: 'Width'
				},
				{
					xtype: "numberfield",
					name: 'textureHeight',
					minValue: 0,
					fieldLabel: 'Height'
				},
				{
					xtype: "numberfield",
					name: 'frameWidth',
					minValue: 0,
					fieldLabel: 'Frame Width'
				},
				{
					xtype: "numberfield",
					name: 'frameHeight',
					minValue: 0,
					fieldLabel: 'Frame Height'
				},
				{
					xtype: "numberfield",
					name: 'innerPadding',
					minValue: 0,
					fieldLabel: 'Inner Padding'
				}
			]
		})


		me.callParent()
	}
});
