Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',
	requires: ['Spelled.nw.Toolbar'],

	border: false,

	initComponent: function() {
		var me = this

		me.items = [
			{
				xtype: Spelled.Configuration.isNodeWebKit() ? 'nwtoolbar' : 'toolbar',
				cls: 'spelledToolbar',
				items: [
					{
						text: 'SpellEd',
						menu: {
							items: [{
                                text    : 'About SpellEd',
                                nwType  : 'normal',
                                action  : 'showAboutDialog'
                            }, {
                                text   : 'Check for Updates...',
                                nwType  : 'normal',
                                action: 'showUpdateDialog'
                            }, {
                                text    : 'Hide SpellEd',
                                appleSelector  : 'hide:',
                                keyEquivalent: 'h'
                            }, {
                                text    : 'Hide Others',
                                appleSelector  : 'hideOtherApplications:',
                                keyEquivalent: 'h'
                            }, {
                                text    : 'Show All',
                                appleSelector  : 'unhideAllApplications:'
                            }, {
                                text    : 'Quit SpellEd',
                                appleSelector  : 'closeAllWindows:',
                                keyEquivalent: 'q'
                            }




                            ]
                        }
                    },
                    {
                        text: 'Project',
                        menu: {
                            items: [{
								text   : 'New Project...',
								tooltip: 'Creates a new Spell-Project',
								action: 'showCreateProject',
                                keyEquivalent: 'n'
                            },{
								text   : 'Open Project...',
								tooltip: 'Load a existing Spell-Project',
								action: 'showLoadProject'
							},{
								text: "Save",
								action: "saveProject",
                                keyEquivalent: 's'

							},{
								text: "Export for deployment",
								action: "exportProject"
							},{
								text   : 'Settings',
								tooltip: 'Edit the project settings',
								action: 'showProjectSettings'
							}]

						}
					},

                    {
                        text: 'Edit',
                        menu: {
                            items: [{
                                text   : 'Undo',
                                appleSelector  : 'undo:',
                                keyEquivalent: 's'
                            },{
                                text   : 'Undo',
                                appleSelector  : 'undo:',
                                keyEquivalent: 's'
                            },{
                                text   : 'Undo',
                                appleSelector  : 'undo:',
                                keyEquivalent: 's'
                            },{
                                text   : 'Redo',
                                appleSelector  : 'undo:',
                                keyEquivalent: 'Z'
                            },{
                                text   : 'Cut',
                                appleSelector  : 'cut:',
                                keyEquivalent: 'x'
                            },{
                                text   : 'Copy',
                                appleSelector  : 'copy:',
                                keyEquivalent: 'c'
                            },{
                                text   : 'Paste',
                                appleSelector  : 'paste:',
                                keyEquivalent: 'v'
                            },{
                                text   : 'Delete',
                                appleSelector  : 'delete:'
                            },{
                                text   : 'Select All',
                                appleSelector  : 'selectAll:',
                                keyEquivalent: 'a'
                            }]

                        }
                    },
					{
						text: 'Layout',
						menu: {
							items: [{
								text   : 'Main layout',
								action: 'changeToMainLayout'
							},{
								text   : 'Split layout',
								action: 'changeToSplitLayout'
							}]

						}
					}/*,
					{
						xtype: 'tool-documentation',
						docString: ""
					}*/
				]
			}
		]

		me.callParent( arguments )
	}
});
