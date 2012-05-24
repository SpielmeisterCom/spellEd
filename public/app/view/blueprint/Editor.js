Ext.define('Spelled.view.blueprint.Editor', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.blueprinteditor',

    title: 'Blueprint Editor',
    titleCollapse: false,
    activeTab: 0,
    bbar: [
        {
            xtype: 'button',
            action: 'showCreateBlueprint',
            text: 'Create a new Blueprint'
        }
    ]
//    ,items: [
//        {
//            xtype: 'panel',
//            layout: {
//                align: 'stretch',
//                type: 'vbox'
//            },
//            closable: true,
//            title: 'spelljs/systems/graphics/...',
//            tabConfig: {
//                xtype: 'tab',
//                flex: 1
//            },
//            items: [
//                {
//                    xtype: 'tabpanel',
//                    frame: false,
//                    activeTab: 0,
//                    plain: false,
//                    flex: 1,
//                    items: [
//                        {
//                            xtype: 'panel',
//                            layout: {
//                                align: 'stretch',
//                                padding: 5,
//                                type: 'vbox'
//                            },
//                            title: 'Configuration',
//                            tabConfig: {
//                                xtype: 'tab',
//                                flex: 1
//                            },
//                            items: [
//                                {
//                                    xtype: 'form',
//                                    bodyPadding: 10,
//                                    collapsible: true,
//                                    title: 'Details',
//                                    margins: '0 0 5 0',
//                                    items: [
//                                        {
//                                            xtype: 'displayfield',
//                                            value: 'SystemBlueprint',
//                                            fieldLabel: 'Type',
//                                            anchor: '100%'
//                                        },
//                                        {
//                                            xtype: 'displayfield',
//                                            value: 'spelljs/systems/graphics/renderer',
//                                            fieldLabel: 'Name',
//                                            anchor: '100%'
//                                        }
//                                    ]
//                                },
//                                {
//                                    xtype: 'treepanel',
//                                    height: 250,
//                                    width: 400,
//                                    autoScroll: false,
//                                    title: 'Inputs',
//                                    hideHeaders: false,
//                                    rootVisible: false,
//                                    flex: 1,
//                                    viewConfig: {
//
//                                    },
//                                    columns: [
//                                        {
//                                            xtype: 'treecolumn',
//                                            dataIndex: 'text',
//                                            flex: 1,
//                                            text: 'Nodes'
//                                        },
//                                        {
//                                            xtype: 'gridcolumn',
//                                            dataIndex: 'value',
//                                            text: 'Value'
//                                        }
//                                    ]
//                                }
//                            ]
//                        },
//                        {
//                            xtype: 'panel',
//                            title: 'Scripts'
//                        }
//                    ]
//                }
//            ]
//        }
//    ]

});