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
                    xtype: 'panel',

                    layout: {
                        align: 'stretch',
                        padding: 5,
                        type: 'vbox'
                    },
                    title: 'Configuration',
                    items: [
                        {
                            xtype: "systemtemplatedetails",
                            flex: 1
                        },
                        {
                            xtype: 'systemtemplateinputlist',
                            flex: 2
                        }
                    ],
                    buttons: [
                        {
                            text: 'Save',
                            action: 'saveTemplate'
                        },
                        {
                            text: 'Cancel',
                            action: 'resetTemplate'
                        }
                    ]
                },
                {
                    xtype: 'scripteditor',
                    closable: false,
                    title: 'Script'
                }
            ]
        }
    ]
});
