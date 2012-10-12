Ext.define('Spelled.controller.Scripts', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.model.Script',
		'Spelled.view.script.Create',
		'Spelled.view.script.FolderPicker',
		'Spelled.view.script.Editor',
		'Spelled.store.script.Scripts'
	],

    views: [
        'script.Create',
        'script.FolderPicker',
        'script.Editor'
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
        this.control({
			'scripteditor': {
				save: this.globalSaveHelper,
				activate: this.refreshAceEditorContent,
				render:   this.addAceEditor
			},
            'librarytreelist [action="showCreateScript"]' : {
                click: this.showCreateScript
            },
            'createscript button[action="createScript"]' : {
                click: this.createScript
            }
        })

		this.application.on( {
				openscenescript   : this.openSceneScript,
				scriptdblclick    : this.openScriptHelper,
				scriptbeforeclose : this.checkIfScriptIsDirty,
				scriptcontextmenu : this.showListContextMenu,
				savescriptpanel   : this.saveScriptInPanel,
				scope : this
			}
		)
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

	openSceneScript: function(  ) {
		var sceneScriptView = this.getRightPanel().down( 'scenescript' )

		if( sceneScriptView ) {
			var scriptId = sceneScriptView.down( 'combo' ).getValue(),
				script   = this.getScriptScriptsStore().findRecord( 'scriptId', scriptId ),
				tree     = this.getScriptsTree(),
				node     = tree.getRootNode().findChild( 'id', script.getId(), true )

			this.getNavigator().setActiveTab( this.getLibrary() )

			if( node ) {
				tree.expandPath( node.getPath() )
				tree.getSelectionModel().select( node )
			}

			this.openScript( script.getId() )
		}
	},

	saveScriptInPanel: function( panel ) {
		var model = panel.model
		if( model.dirty ) model.save()
	},

	addAceEditor: function( panel ) {
		panel.aceEditor = Ext.amdModules.ace.edit( panel.id )

		var SpellScriptMode = Ext.amdModules.aceModeSpellScript.Mode
		panel.aceEditor.getSession().setMode( new SpellScriptMode() )
		panel.aceEditor.setTheme( Ext.amdModules.aceThemePastelOnDark )
	},

	refreshAceEditorContent: function( panel ) {
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
			var foundTab = this.application.findActiveTabByTitle( scriptEditor, script.get( 'scriptId' ) )

			if( foundTab )
				return foundTab

			var view = Ext.widget( 'scripteditor', {
				title: script.get('scriptId'),
				model: script
			} )

			this.application.createTab( scriptEditor, view )
		}
	},

    showCreateScript: function() {
        var View = this.getScriptCreateView()
        var view = new View( )
        view.show()
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

			Spelled.StorageActions.create(
				{ id: id + ".js", content: script.get( 'content' ) },
				function( id ) {
					script.set( 'path', id )

					script.save({
							success: function( record ) {
								Ext.Msg.alert('Success', 'Your Script "' + record.get( 'scriptId' ) + '" has been created.')
								me.refreshStores()

								window.close()
							}
						}
					)
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
    }
});
