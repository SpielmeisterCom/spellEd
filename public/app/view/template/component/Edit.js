Ext.define('Spelled.view.template.component.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.componenttemplateedit',
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
                            xtype: "componenttemplatedetails",
                            flex: 1
                        },
                        {
                            xtype: 'componenttemplateattributeslist',
                            flex: 2
                        },
                        {
                            xtype: 'componenttemplateproperty',
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
