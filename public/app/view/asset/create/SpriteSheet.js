Ext.define('Spelled.view.asset.create.SpriteSheet', {
    extend: 'Ext.container.Container',
    alias: 'widget.spritesheetconfig',

	items: [
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
			fieldLabel: 'Frame Height'
		}
	]
});
