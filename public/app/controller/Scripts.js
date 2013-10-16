Ext.define('Spelled.controller.Scripts', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.model.Script',
		'Spelled.view.script.Create',
		'Spelled.view.script.FolderPicker',
		'Spelled.view.script.Editor',
		'Spelled.store.script.Scripts',
		'Spelled.view.script.Properties',

		'Spelled.Remoting'
	],

    views: [
        'script.Create',
        'script.FolderPicker',
        'script.Editor',
		'script.Properties'
    ],

    stores: [
        'script.Scripts'
    ],

    models: [
        'Script'
    ],

    refs: [
		{
			ref: 'Navigator',
			selector: '#Navigator'
		},
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref: 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'ScriptsTree',
			selector: '#LibraryTree'
		},
		{
			ref: 'ScriptEditor',
			selector: '#SceneEditor'
		},
		{
			ref : 'Library',
			selector: '#Library'
		}
    ],

    init: function() {
		this.listen({
			component: {
				'scripteditor': {
					save:     this.globalSaveHelper,
					render:   this.addEditor
				},
				'librarymenu [action="showCreateScript"]' : {
					click: this.showCreateScript
				},
				'createscript button[action="createScript"]' : {
					click: this.createScript
				}
			},
			controller: {
				'*': {
					scriptdblclick    : this.openScriptHelper,
					scriptbeforeclose : this.checkIfScriptIsDirty,
					scriptcontextmenu : this.showListContextMenu,
					savescriptpanel   : this.saveScriptInPanel,
					scriptselect      : this.showScriptDependenciesHelper,
					refreshscripttab  : this.refreshScriptTab
				}
			}
        })
    },

	showScriptDependencies: function( script ) {
		this.getRightPanel().setTitle( 'Script dependencies' )
		this.getRightPanel().add( { xtype: 'scriptproperties', record: script } )
	},

	showScriptDependenciesHelper: function( tree, node ) {
		var script = Ext.getStore( 'script.Scripts' ).getById( node.getId() )

		if( script ) {
			this.showScriptDependencies( script )
		}
	},

	checkIfScriptIsDirty: function( panel ) {
		var script = panel.model

		if( script.dirty ) {
			var callback = function( button ) {
				if ( button === 'yes') panel.destroy()
			}

			this.application.dirtySaveAlert( script, callback )
			return false
		} else {
			panel.destroy()
		}
	},

	globalSaveHelper: function() {
		this.application.fireEvent( 'globalsave' )
	},

	saveScriptInPanel: function( panel ) {
		var model = panel.model
		if( model.dirty ) model.save()
	},

	addEditor: function( panel ) {
		panel.refreshContent()
	},

    removeScript: function( scriptId ) {
        var editorTab = this.getScriptEditor(),
			script    = this.getScriptScriptsStore().getById( scriptId )

		this.application.closeOpenedTabs( editorTab, script.get('name') )
		script.destroy()
		this.refreshStores()
    },

    openScriptHelper: function( treePanel, record ) {
        if( !record.data.leaf ) return

		this.openScript( record.getId() )
    },

	openScript: function( scriptId ) {
		var scriptEditor = this.getScriptEditor(),
			script       = this.getScriptScriptsStore().getById( scriptId )

		if( script ) {
			var foundTab = this.application.findActiveTabByTitle( scriptEditor, script.getFullName() )

			if( foundTab )
				return foundTab

			var view = Ext.widget( 'scripteditor', {
				title: script.getFullName(),
				model: script
			} )

			this.application.createTab( scriptEditor, view )
		}
	},

    showCreateScript: function( button ) {
        var View        = this.getScriptCreateView(),
			view        = new View()

        view.show()

		this.application.fireEvent( 'selectnamespacefrombutton', view, button )
    },

    createScript: function( button ) {
        var me     = this,
			window = button.up( 'window' ),
            form   = window.down('form').getForm(),
			Script = this.getScriptModel(),
			values = form.getValues(),
			content = {
				name: values.name,
				namespace: ( values.folder === 'root' ) ? '' : values.folder.substring( 5 ),
				type: 'script'
			},
			id = this.application.generateFileIdFromObject( content )

		content.id = id + ".json"
		var script = Script.create( content )

        if( form.isValid() ){
			script.set( 'content', this.createModuleHeader( script.getFullName(), '' ) )
			script.set( 'path', script.getAccordingJSFileName() )

			script.save({
					success: function( record ) {
						Ext.Msg.alert('Success', 'Your Script "' + record.getFullName() + '" has been created.')
						me.getScriptScriptsStore().add( record )

						window.close()
					}
				}
			)
		}
    },

	createModuleHeader: function( name, content, prefix ) {
		var parts = []

		if( prefix ) parts.push( prefix )

		parts = parts.concat( [
			"define(",
			"	'" + name.replace(/\./g, "/") + "',",
			"	[",
			"		'spell/functions'",
			"	],",
			"	function(",
			"		_",
			"	) {",
			"		'use strict'",
			"		",
			"		",
			"		" + content,
			"	}",
			")",
			""
		] )

		return parts.join( "\n" )
	},

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showScriptsListContextMenu( e )
    },

    refreshStores: function() {
		this.getScriptScriptsStore().load()
    },

	refreshScriptTab: function( tab, model ) {
		tab.setReadOnly( model.isReadonly() )
		tab.setModel( model )
		tab.refreshContent()
	}
});
