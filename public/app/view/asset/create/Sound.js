Ext.define('Spelled.view.asset.create.Sound', {
    extend: 'Ext.container.Container',
    alias: 'widget.soundasset',

	requires: [
		'Ext.form.field.File',
		'Ext.draw.Text',
		'Spelled.view.asset.create.SoundFileField'
	],

	initComponent: function() {
		Ext.applyIf(
			this, {
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
								xtype: 'fieldset',
								margin: 5,
								title: 'Mp3-File',
								items: [{
									xtype: 'soundfilefield',
									extension: 'mp3',
									showToolbar: this.edit
								}]
							},
							{
								xtype: 'fieldset',
								margin: 5,
								title: 'Ogg-File',
								items: [{
									xtype: 'soundfilefield',
									extension: 'ogg',
									showToolbar: this.edit
								}]
							},
							{
								hidden: true,
								xtype: 'text',
								text: 'Nothing changed'
							}
						]
					}
				]
			}
		)

		this.callParent()
	}
});
