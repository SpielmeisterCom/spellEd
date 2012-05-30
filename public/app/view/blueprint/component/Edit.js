Ext.define('Spelled.view.blueprint.component.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.componentblueprintedit',
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
                            xtype: "componentblueprintdetails",
                            flex: 1
                        },
                        {
                            xtype: 'componentblueprintattributeslist',
                            flex: 2
                        },
                        {
                            xtype: 'componentblueprintproperty',
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