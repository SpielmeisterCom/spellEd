
Ext.define('Spelled.view.ui.SpelledViewport', {
    extend: 'Ext.container.Viewport',


    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    height: 1000,
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            flex: 1,
                            items: [
                                {
                                    id: "ZonesTree",
                                    xtype: 'zonetreelist',
                                    height: 200
                                },
                                {
                                    xtype: 'treepanel',
                                    title: 'Assets & Entities',
                                    viewConfig: {

                                    }
                                },
                                {
                                    xtype: 'propertygrid',
                                    title: 'Configuration',
                                    source: {
                                        'Property 1': 'String',
                                        'Property 2': true,
                                        'Property 3': '2012-04-10T11:52:41',
                                        'Property 4': 123
                                    },
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'tabpanel',
                            activeTab: 1,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'panel',
                                    title: 'Rendered Zone'
                                },
                                {
                                    xtype: 'panel',
                                    title: 'Script',
                                    layout: "fit",
                                    items:[
                                        Ext.create('Spelled.view.ui.SpelledEditor')
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    title: 'Image'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});