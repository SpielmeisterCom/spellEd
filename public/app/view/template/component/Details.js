Ext.define('Spelled.view.template.component.Details', {
    extend: 'Ext.form.Panel',
    alias : 'widget.componenttemplatedetails',

    bodyPadding: 10,
    collapsible: true,
    hideCollapseTool: false,
    title: 'Details',
	frame: true,
    titleCollapse: false,
    margins: '0 0 5 0',
    items: [
        {
            xtype: 'displayfield',
            fieldLabel: 'Type',
            name: 'type',
            anchor: '100%'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Name',
            name: 'tmpName',
            anchor: '100%'
        },
		{
			xtype: 'textfield',
			fieldLabel: 'Icon',
			name: 'icon',
			anchor: '100%'
		},
		{
			xtype: 'textfield',
			fieldLabel: 'Title',
			name: 'title',
			anchor: '100%'
		},
		{
			xtype: 'textfield',
			fieldLabel: 'Documentation',
			name: 'doc',
			anchor: '100%'
		}
    ]
});
