Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',
	requires: ['Spelled.nw.Toolbar', 'Spelled.view.ui.SpelledAboutDialog'],

	border: false,

	layoutMenu: {
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
	},
	editMenu:{
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
	projectMenu:{
		text: 'Project',
		menu: {
			items: [{
				text   : 'New Project...',
				tooltip: 'Creates a new Spell-Project',
				action: 'showCreateProject',
				keyEquivalent: 'n'
			},{
				text   : 'Open Project...',
				tooltip: 'Opens an existing Spell-Project',
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
	spellEdGeneralMenu: {
		text: 'SpellEd',
		menu: {
			items: [{
				text    : 'Change  workspace',
				nwType  : 'normal',
				action  : 'showSetWorkspace',
				hidden  : !Spelled.platform.Adapter.isNodeWebKit()
			}, {
				text    : 'About SpellEd',
				nwType  : 'normal',
				action  : 'showAboutDialog'
			}, {
				text    : 'Report a bug',
				nwType  : 'normal',
				action  : 'showBugReportDialog'
			}, {
				text    : 'Send us feedback',
				nwType  : 'normal',
				action  : 'showFeedbackDialog'
			}, {
				text    : 'Check for Updates...',
				nwType  : 'normal',
				action  : 'showUpdateDialog',
				hidden  : !Spelled.platform.Adapter.isNodeWebKit()
			}, {
				text    : 'Hide SpellEd',
				appleSelector  : 'hide:',
				keyEquivalent: 'h',
				hidden  : !Spelled.platform.Adapter.isMacOs()
			}, {
				text    : 'Hide Others',
				appleSelector  : 'hideOtherApplications:',
				keyEquivalent: 'h',
				hidden  : !Spelled.platform.Adapter.isMacOs()
			}, {
				text    : 'Show All',
				appleSelector  : 'unhideAllApplications:',
				hidden  : !Spelled.platform.Adapter.isMacOs()
			}, {
				text    : 'Quit SpellEd',
				appleSelector  : 'closeAllWindows:',
				keyEquivalent: 'q',
				hidden  : !Spelled.platform.Adapter.isMacOs()
			}]
		}
	},

	initComponent: function() {
		var me        = this,
			menuItems = [
				this.spellEdGeneralMenu,
				this.projectMenu,
				Spelled.platform.Adapter.isMacOs() ? this.editMenu : null,
				this.layoutMenu
			]

		Ext.applyIf(me, {
			items : {
				xtype: Spelled.app.platform.getToolbarXType(),
				cls: 'spelledToolbar',
				items: menuItems
			}
		})

		me.callParent( arguments )
	}
});
