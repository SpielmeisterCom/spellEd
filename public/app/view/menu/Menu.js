Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',
	requires: ['Spelled.nw.Toolbar', 'Spelled.view.ui.SpelledAboutDialog', 'Spelled.view.build.menu.Targets'],

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
				tooltip: Spelled.Configuration.isDemoInstance() ? Spelled.Configuration.getDemoTooltipText() : 'Creates a new Spell-Project',
				action: 'showCreateProject',
				keyEquivalent: 'n',
				disabled: Spelled.Configuration.isDemoInstance()
			},{
				text   : 'Open Project...',
				tooltip: 'Opens an existing Spell-Project',
				action: 'showLoadProject'
			},{
				text: "Save",
				action: "saveProject",
				keyEquivalent: 's',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip: Spelled.Configuration.getDemoTooltipText()
			},{
				text   : 'Settings',
				tooltip: 'Edit the project settings',
				action: 'showProjectSettings'
			}]

		}
	},

	buildMenu:{
		text: 'Build',
		menu: {
			ignoreParentClicks: true,
			items: [{
				text   : 'Clean',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip: Spelled.Configuration.getDemoTooltipText( 'Cleans up the build directory.' ),
				action: 'callCleanBuild'
			},{
				text   : 'Debug',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip: Spelled.Configuration.getDemoTooltipText( 'Generates a debug build for a specified target.' ),
				menu: {
					xtype: 'buildtargetsmenu',
					action: 'callDebugTarget'
				}
			},{
				text   : 'Release',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip: Spelled.Configuration.getDemoTooltipText( 'Generates a debug build for a specified target.' ),
				menu: {
					xtype: 'buildtargetsmenu',
					action: 'callReleaseTarget'
				}
			},{
				text   : 'Export',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip: Spelled.Configuration.getDemoTooltipText( 'Generates a release build for a specified target packages it.' ),
				menu: {
					xtype: 'buildtargetsmenu',
					action: 'callExportTarget'
				}
			}
			]
		}
	},
	spellEdGeneralMenu: {
		text: 'SpellEd',
		menu: {
			items: [{
				text    : 'Register',
				nwType  : 'normal',
				action  : 'showRegister',
				disabled: Spelled.Configuration.isDemoInstance(),
				tooltip : Spelled.Configuration.getDemoTooltipText(),
				hidden  : !Spelled.platform.Adapter.isNodeWebKit()
			},{
				text    : 'Settings',
				nwType  : 'normal',
				action  : 'showSettings',
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
				this.buildMenu,
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
