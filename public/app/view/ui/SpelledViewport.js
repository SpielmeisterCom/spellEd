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
                    collapsible: false,
					region:'north'
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
                            id: "Scenes",
                            xtype: "scenesnavigator"
                        },
						{
							id: "Templates",
							xtype: "templatesnavigator"
						},
                        {
                            id: "Assets",
                            xtype: "assetsnavigator"
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
                            id: "SceneEditor",
                            xtype: "sceneeditor"
                        },
						{
							id: "TemplateEditor",
							xtype: "templateeditor"
						},
                        {
                            id: "AssetEditor",
                            xtype: "asseteditor"
                        },
                        {
                            id: "ScriptEditor",
                            xtype: "scriptmanager"
                        }
                    ]
                },
				{
					id: "RightPanel",
					xtype: 'rightpanel'
				},
                {
					id: "SpelledConsole",
                    xtype : 'console',
                    region: 'south'
                }
            ]
        });

        me.callParent(arguments);
    }
});
