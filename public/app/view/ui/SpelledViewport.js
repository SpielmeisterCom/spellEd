Ext.define('Spelled.view.ui.SpelledViewport', {
    extend: 'Ext.container.Viewport',
	requires: [
		'layout.border'
	],

    layout: 'border',

    defaults: {
        collapsible: true
    },

	listeners: {
		add: function (c, i) {
			if (i.xtype == 'bordersplitter') {
				i.width = 2;
				i.height = 2;
				i.style = {
					backgroundColor: '#646464'
				};
			}
		}
	},

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'spelledmenu',
                    collapsible: false,
					isNodeWebkit: Spelled.Configuration.isNodeWebKit(),
					isMacOs: Spelled.Configuration.isMacOs(),
					region:'north'
                },
                {
					id: "Navigator",
					defaultTitle: "ProjectName",
                    xtype: 'tabpanel',
                    tabPosition: 'bottom',
                    region:'west',
                    width: 350,
                    minSize: 200,
					split: true,
                    items: [
                        {
                            id: "Scenes",
                            xtype: "scenesnavigator"
                        },
						{
							id: "Library",
							xtype: "librarynavigator"
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
							xtype: "mainlayout"
						},
						{
							xtype: "splitlayout",
							hidden: true
						}
                    ]
                },
				{
					id: "RightPanel",
					split: true,
					xtype: 'rightpanel'
				},
                {
					id: "SpelledConsole",
					split: true,
                    xtype : 'console',
                    region: 'south'
                }
            ]
        });

        me.callParent(arguments);
    }
});
