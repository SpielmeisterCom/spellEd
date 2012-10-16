Ext.define('Spelled.view.asset.edit.Edit', {
	extend: 'Spelled.view.asset.Form',
	alias  : 'widget.editasset',
	closable: true,

	buttons: [],

	items: [
		{
			xtype: 'filefield',
			name: 'asset',
			fieldLabel: 'File',
			labelWidth: 50,
			msgTarget: 'side',
			buttonText: 'Select a File...'
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
		},{
			xtype: '2dtilemapconfig',
			hidden: true
		}
	]
});
