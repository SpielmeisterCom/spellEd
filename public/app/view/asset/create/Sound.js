Ext.define('Spelled.view.asset.create.Sound', {
    extend: 'Ext.container.Container',
    alias: 'widget.soundasset',

	requires: [
		'Ext.form.field.File',
		'Spelled.view.asset.create.SoundFileField'
	],

	items: [
		{
			xtype: 'tool-documentation',
			docString: "#!/guide/asset_type_sound",
			width: 'null'
		},
		{
			xtype: 'localizedfilefield',
			fileFields: [
				{
					xtype: 'soundfilefield',
					fieldLabel: 'Mp3-File'
				},
				{
					xtype: 'soundfilefield',
					fieldLabel: 'Ogg-File'
				}
			]
		}
	]
});
