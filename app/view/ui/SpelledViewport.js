Ext.define('Spelled.view.ui.SpelledViewport', {
    extend: 'Ext.container.Viewport',

    layout: 'border',

    defaults: {
        collapsible: true,
        split: true
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'spelledmenu',
                    collapsible: false
                },
                {
                    title: "Project - Navigator",
                    xtype: 'tabpanel',
                    tabPosition: 'bottom',
                    region:'west',
                    width: 250,
                    minSize: 100,
                    items: [
                        {
                            id: "Zones",
                            xtype: "zonesnavigator"
                        },
                        {
                            id: "Assets",
                            xtype: "assetsnavigator"
                        },
                        {
                            id: "Blueprints",
                            xtype: "blueprintsnavigator"
                        }
                    ]
                },
                {
                    id: "MainPanel",
                    collapsible: false,
                    region:'center',
                    layout: 'fit',
                    items:[
                        {
                            id: "ZoneEditor",
                            xtype: "zoneeditor"
                        },
                        {
                            id: "AssetEditor",
                            xtype: "asseteditor"
                        },
                        {
                            id: "BlueprintEditor",
                            xtype: "blueprinteditor"
                        }
                    ]
                },
                {
                    xtype : 'console',
                    region: 'south'
                }
            ]
        });

        me.callParent(arguments);
    }
});