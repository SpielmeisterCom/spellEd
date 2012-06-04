Ext.define('Spelled.view.blueprint.system.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemblueprintedit',
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
                            xtype: "systemblueprintdetails",
                            flex: 1
                        },
                        {
                            xtype: 'systemblueprintinputlist',
                            flex: 2
                        }
                    ],
                    buttons: [
                        {
                            text: 'Save',
                            action: 'saveBlueprint'
                        },
                        {
                            text: 'Cancel',
                            action: 'resetBlueprint'
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