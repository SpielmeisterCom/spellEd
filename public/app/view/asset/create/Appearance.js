Ext.define('Spelled.view.asset.create.Appearance', {
    extend: 'Ext.container.Container',
    alias: 'widget.appearanceasset',

	padding: 5,

	requires: [
		'Ext.form.field.File',
		'Spelled.view.asset.create.LocalizedFileField'
	],

	items: [
		{
			xtype: 'tool-documentation',
			docString: "#!/guide/asset_type_2d_static_appearance",
			width: 'null'
		},
		{
			xtype: 'localizedfilefield'
		}
	]
});
