Ext.define('Spelled.view.scene.Script' ,{
	extend: 'Ext.form.Panel',
	alias: 'widget.scenescript',

	padding: '15px',
	border: false,

	docString: "#!/guide/concepts_scripts",

	items: [
		{
			xtype: 'combobox',
			editable: false,
			fieldLabel: 'Script',
			displayField : 'name',
			valueField: 'name',
			store: 'script.Scripts',
			name: 'scriptId'
		}
	]
});
