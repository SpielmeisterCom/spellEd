Ext.define('Spelled.view.asset.create.Texture', {
    extend: 'Ext.container.Container',
    alias: 'widget.textureasset',

	items: [
		{
			xtype: "textfield",
			name: 'position',
			fieldLabel: 'Position'
		},
		{
			xtype: "textfield",
			name: 'rotation',
			fieldLabel: 'Rotation'
		}
	]
});
