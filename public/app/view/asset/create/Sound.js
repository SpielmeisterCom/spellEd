Ext.define('Spelled.view.asset.create.Sound', {
    extend: 'Ext.container.Container',
    alias: 'widget.soundasset',

	requires: [
		'Ext.form.field.File'
	],

	items: [
		{
			xtype: 'tool-documentation',
			docString: "#!/guide/asset_type_sound",
			width: 'null'
		},
		{
			xtype: 'assetfilefield'
		}
	]
});
