Ext.define('Spelled.view.blueprint.entity.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.entityblueprintedit',
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
                            xtype: "entityblueprintdetails"
                        },
                        {
                            xtype: 'entityblueprintcomponentslist'
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