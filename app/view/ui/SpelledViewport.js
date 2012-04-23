Ext.define('Spelled.view.ui.SpelledViewport', {
    extend: 'Ext.container.Viewport',


    initComponent: function() {
        var me = this;

        var dispatchPostMessages = function( event ) {

            if ( event.origin !== location.href ){
               console.log( "WRONG produced origin!")
               //return;
            }

            if( event.data.action === 'getConfiguration' ) {

                var cmp = Ext.getCmp( event.data.extId )

                var Zone = Ext.ModelManager.getModel('Spelled.model.Zone')

                Zone.load( cmp.zoneId, {
                    success: function( zone ) {

                        cmp.el.dom.contentWindow.postMessage( {
                            id: cmp.id,
                            type: "setConfiguration",
                            data: zone.get('content')
                        }, location.href )
                    }
                })

            }
        }

        window.addEventListener("message", dispatchPostMessages, false);

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
                            region: 'east',
                            xtype: 'tabpanel'

                        },
                        {
                            id: "MainPanel",
                            xtype: 'tabpanel',
                            collapsible: false,
                            region:'center',
                            margins: '5 0 0 0'
                        },
                        {
                            xtype : 'console',
                            region: 'south'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});