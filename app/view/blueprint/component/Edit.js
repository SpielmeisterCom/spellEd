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
                            xtype: 'form',
                            bodyPadding: 10,
                            title: 'Properties',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'displayfield',
                                    width: 447,
                                    value: 'spelljs/core',
                                    fieldLabel: 'Namespace',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Name',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Type',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'textareafield',
                                    fieldLabel: 'Default value',
                                    anchor: '100%'
                                }
                            ]
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