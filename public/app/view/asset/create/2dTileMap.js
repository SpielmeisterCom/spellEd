Ext.define('Spelled.view.asset.create.2dTileMap', {
    extend: 'Ext.container.Container',
    alias: 'widget.2dtilemapconfig',

	items: [
		{
			xtype: 'numberfield',
			fieldLabel: 'Tile size',
			name: 'tileSize'
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
		}
	]
});
