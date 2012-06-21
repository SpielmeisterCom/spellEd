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
					id: "Navigator",
                    title: "Project - Navigator",
                    xtype: 'tabpanel',
                    tabPosition: 'bottom',
                    region:'west',
                    width: 350,
                    minSize: 200,
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
                        },
                        {
                            id: "Scripts",
                            xtype: "scriptsnavigator"
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
                        },
                        {
                            id: "ScriptEditor",
                            xtype: "scriptmanager"
                        }
                    ]
                },
				{
					id: "RightPanel",
					title: "Inspector",
					defaultTitle: "Inspector",
					region:'east',
					layout: 'fit',
					width: 300,
					minSize: 100
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