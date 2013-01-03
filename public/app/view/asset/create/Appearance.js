Ext.define('Spelled.view.asset.create.Appearance', {
    extend: 'Ext.container.Container',
    alias: 'widget.appearanceasset',

	requires: [
		'Ext.form.field.File'
	],

	items: [
		{
			xtype: 'tool-documentation',
			docString: "#!/guide/asset_type_2d_static_appearance",
			width: 'null'
		},
		{
			xtype: 'assetfilefield'
		}
	]
});
