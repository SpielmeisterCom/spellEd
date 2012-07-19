Ext.define('Spelled.view.template.system.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemtemplateedit',
    closable: true,

    layout: {
        align: 'stretch',
        type: 'vbox'
    },

    items: [
        {
            xtype: 'tabpanel',
            activeTab: 0,
            flex: 1,

            items: [
                {
                    xtype: 'scripteditor',
                    closable: false,
                    title: 'Script'
                }
            ]
        }
    ]
});
