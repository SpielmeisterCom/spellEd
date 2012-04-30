Ext.define('Spelled.view.blueprint.component.Details', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.componentblueprintdetails',

    bodyPadding: 10,
    collapsible: true,
    hideCollapseTool: false,
    title: 'Details',
    titleCollapse: false,
    margins: '0 0 5 0',
    items: [
        {
            xtype: 'displayfield',
            fieldLabel: 'Type',
            anchor: '100%'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Name',
            anchor: '100%'
        }
    ]
});