Ext.define('Spelled.view.asset.create.SpriteSheet', {
    extend: 'Ext.container.Container',
    alias: 'widget.spritesheetconfig',

	initComponent: function() {
	    var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#SpriteSheet-Documentation",
					width: 'null'
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
				}
			]
		})


		me.callParent()
	}
});
