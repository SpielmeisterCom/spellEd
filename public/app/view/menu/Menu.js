Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',
	requires: ['Spelled.nw.Toolbar', 'Spelled.view.ui.SpelledAboutDialog'],

	border: false,
	isNodeWebkit: false,
	isMacOs: false,

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
			items: [
				{
					text    : 'Change  workspace',
					nwType  : 'normal',
					action  : 'showSetWorkspace',
					hidden  : !this.isNodeWebkit
				}, {
					text    : 'About SpellEd',
					nwType  : 'normal',
					action  : 'showAboutDialog'
				}, {
					text   : 'Check for Updates...',
					nwType  : 'normal',
					action: 'showUpdateDialog',
					hidden  : !this.isNodeWebkit
				}, {
					text    : 'Hide SpellEd',
					appleSelector  : 'hide:',
					keyEquivalent: 'h',
					hidden  : !this.isMacOs
				}, {
					text    : 'Hide Others',
					appleSelector  : 'hideOtherApplications:',
					keyEquivalent: 'h',
					hidden  : !this.isMacOs
				}, {
					text    : 'Show All',
					appleSelector  : 'unhideAllApplications:',
					hidden  : !this.isMacOs
				}, {
					text    : 'Quit SpellEd',
					appleSelector  : 'closeAllWindows:',
					keyEquivalent: 'q',
					hidden  : !this.isMacOs
				}
			]
		}
	},

	initComponent: function() {
		var me        = this,
			menuItems = [
				this.spellEdGeneralMenu,
				this.projectMenu,
				this.isMacOs ? this.editMenu : null,
				this.layoutMenu
			]

		Ext.applyIf(me, {
			items : {
				xtype: this.isNodeWebkit ? 'nwtoolbar' : 'toolbar',
				cls: 'spelledToolbar',
				items: menuItems
			}
		})

		me.callParent( arguments )
	}
});
