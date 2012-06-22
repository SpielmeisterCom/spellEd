Ext.define('Spelled.view.template.Editor', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.templateeditor',

    title: 'Template Editor',
    titleCollapse: false,
    activeTab: 0,
    bbar: [
        {
            xtype: 'button',
            action: 'showCreateTemplate',
            text: 'Create a new Template'
        }
    ]
});
