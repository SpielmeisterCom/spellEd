Ext.define('Spelled.view.blueprint.system.Details', {
    extend: 'Ext.form.Panel',
    alias : 'widget.systemblueprintdetails',

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
            xtype: 'combobox',
            fieldLabel: 'Script',
            name: 'scriptId'
        }
    ]
});