Ext.define('Spelled.view.zone.Script' ,{
	extend: 'Ext.form.Panel',
	alias: 'widget.zonescript',

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