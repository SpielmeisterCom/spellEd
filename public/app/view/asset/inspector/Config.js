Ext.define('Spelled.view.asset.inspector.Config', {
    extend: 'Ext.form.Panel',
    alias: 'widget.assetconfig',

	border: false,
	padding: '5px',

	docString: '#!/guide/concepts_assets',

	items: [
		{
			title: 'Details',
			frame: true,
			padding: '15px',
			items: [
				{
					xtype: "displayfield",
					readOnly: true,
					name: 'internalAssetId',
					fieldLabel: 'Identifier'
				},
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
		}
	]
});
