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
                            xtype: "componentblueprintdetails"
                        },
                        {
                            xtype: 'componentblueprintattributeslist'
                        },
                        {
                            xtype: 'componentblueprintproperty'
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