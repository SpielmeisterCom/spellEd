Ext.define('Spelled.view.template.entity.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.entitytemplateedit',
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
                            xtype: "entitytemplatedetails",
                            flex: 1
                        },
                        {
                            xtype: 'entitytemplatecomponentslist',
                            flex: 2
                        },
                        {
                            xtype: 'entitytemplateproperty',
                            flex: 2
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Script'
                }
            ]
        }
    ]
});