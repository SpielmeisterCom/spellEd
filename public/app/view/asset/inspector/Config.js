Ext.define('Spelled.view.asset.inspector.Config', {
    extend: 'Ext.form.Panel',
    alias: 'widget.assetconfig',

	padding: '15px',
	border: false,

	items: [
		{
			xtype: "combo",
			readOnly: true,
			readOnlyCls: '',
			name: 'type',
			hideTrigger: true,
			store: 'asset.Types',
			queryMode: 'local',
			fieldLabel: "Type",
			displayField: 'name',
			valueField: 'type'
		},
		{
			xtype: "displayfield",
			readOnly: true,
			name: 'file',
			fieldLabel: 'File'
		},
		{
			xtype: "displayfield",
			readOnly: true,
			name: 'namespace',
			fieldLabel: 'Namespace'
		},
		{
			xtype: "displayfield",
			readOnly: true,
			name: 'name',
			fieldLabel: 'Name'
		}
	]
});
