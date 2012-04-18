
Ext.define('Spelled.view.ui.SpelledViewport', {
    extend: 'Ext.container.Viewport',


    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    height: '100%',
                    layout: 'border',
                    defaults: {
                        collapsible: true,
                        split: true
                    },
                    items: [
                        {
                            xtype: 'spelledmenu',
                            collapsible: false
                        },
                        {
                            title: "Project - Navigator",
                            region:'west',
                            margins: '5 0 0 0',
                            cmargins: '5 5 0 0',
                            width: 250,
                            minSize: 100,
                            items: [
                                {
                                    id: "ZonesTree",
                                    xtype: 'zonetreelist',
                                    height: 200
                                },
                                {
                                    id: "EntityList",
                                    xtype: 'entiteslist',
                                    height: 200
                                },
                                {
                                    xtype: 'propertygrid',
                                    title: 'Configuration',
                                    source: {
                                        'Property 1': 'String',
                                        'Property 2': true,
                                        'Property 3': '2012-04-10T11:52:41',
                                        'Property 4': 123
                                    }
                                }
                            ]
                        },
                        {
                            id: "MainPanel",
                            xtype: 'tabpanel',
                            collapsible: false,
                            region:'center',
                            margins: '5 0 0 0'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});