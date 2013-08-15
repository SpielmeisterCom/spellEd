Ext.define('Spelled.view.asset.create.SoundFileField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.soundfilefield',

	width: '100%',

	layout: 'hbox',

	items: [
		{ xtype: 'assetfilefield', hideLabel: true, flex: 1 },
		{ xtype: 'splitter' },
		{ text: 'textfield', flex: 1 }
	]
});
