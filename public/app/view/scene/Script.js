Ext.define('Spelled.view.scene.Script' ,{
	extend: 'Ext.form.Panel',
	alias: 'widget.scenescript',

	padding: '5px',
	border: false,

	docString: "#!/guide/concepts_scripts",

	items: [
		{
			title: 'Details',
			frame: true,
			padding: '15px',
			items: [
				{
					xtype: 'combobox',
					editable: false,
					fieldLabel: 'Script',
					displayField : 'scriptId',
					valueField: 'scriptId',
					store: 'script.Scripts',
					name: 'scriptId'
				}
			]
		}
	]
});
