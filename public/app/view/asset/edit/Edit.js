Ext.define('Spelled.view.asset.edit.Edit', {
	extend: 'Spelled.view.asset.Form',
	alias  : 'widget.editasset',
	closable: true,

	buttons: [],

	items: [
		{
			xtype: "combo",
			disabled: true,
			readOnly: true,
			name: 'subtype',
			editable: false,
			emptyText: '-- Select Type --',
			store: 'asset.Types',
			queryMode: 'local',
			fieldLabel: "Type",
			displayField: 'name',
			valueField: 'type'
		},
		{
			xtype: "textfield",
			disabled: true,
			name: 'name',
			fieldLabel: 'Name'
		},
		{
			xtype: "textfield",
			disabled: true,
			name: 'namespace',
			fieldLabel: 'Namespace'
		},
		{
			xtype: 'filefield',
			name: 'asset',
			fieldLabel: 'File',
			labelWidth: 50,
			msgTarget: 'side',
			buttonText: 'Select a File...'
		},
		{
			xtype: 'menuseparator'
		},{
			xtype: 'spritesheetconfig',
			hidden: true
		},{
			xtype: 'animationassetconfig',
			hidden: true
		},{
			xtype: 'textappearanceconfig',
			hidden: true
		},{
			xtype: 'keytoactionconfig',
			hidden: true
		},{
			xtype: 'domvasassetconfig',
			hidden: true
		},{
			xtype: 'keyframeanimationconfig',
			hidden: true
		}
	]
});
