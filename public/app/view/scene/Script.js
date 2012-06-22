Ext.define('Spelled.view.scene.Script' ,{
	extend: 'Ext.form.Panel',
	alias: 'widget.scenescript',

	padding: '15px',
	border: false,

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
