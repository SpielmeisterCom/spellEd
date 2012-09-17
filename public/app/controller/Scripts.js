Ext.define('Spelled.controller.Scripts', {
    extend: 'Ext.app.Controller',

    views: [
        'script.Create',
        'script.FolderPicker',
        'script.Editor',
        'script.TreeList',
        'script.Manager',
        'script.Navigator'
    ],

    stores: [
        'script.Scripts',
        'script.Tree',
        'script.FoldersTree'
    ],

    models: [
        'Script'
    ],

    refs: [
		{
			ref: 'ScriptEditor',
			selector: '#ScriptEditor'
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
			selector: '#ScriptsTree'
		}
    ],

    init: function() {
        this.control({
			'scripteditor': {
				beforeclose: this.checkIfScriptIsDirty,
				save: this.globalSaveHelper,
				activate: this.refreshAceEditorContent,
				render:   this.addAceEditor
			},
            'scriptsnavigator': {
                activate: this.showScripts
            },
            'scriptstreelist': {
                itemdblclick:    this.openScriptHelper,
                itemcontextmenu: this.showListContextMenu,
                editclick:       this.showListContextMenu,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'scriptstreelist [action="showCreateScript"]' : {
                click: this.showCreateScript
            },
            'createscript button[action="createScript"]' : {
                click: this.createScript
            }
        })

		this.application.on( {
				'globalsave' : this.saveAllScriptsInTabs,
				'savescriptpanel' : this.saveScriptInPanel,
				scope: this
			}
		)
    },

	saveAllScriptsInTabs: function() {
		this.getScriptEditor().items.each(
			function( panel ) {
				this.saveScriptInPanel( panel )
			},
			this
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
				script   = this.getScriptScriptsStore().findRecord( 'name', scriptId),
				tree     = this.getScriptsTree(),
				node     = tree.getRootNode().findChild( 'id', script.get('path'), true )

			Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Scripts') )

			//TODO: find solution for asynchronous closed folders
			if( node ) {
				tree.expandPath( node.getPath() )
				tree.getSelectionModel().select( node )
			}

			this.openScript( scriptId )
		}
	},

	saveScriptInPanel: function( panel ) {
		var model = panel.model
		if( model.dirty ) model.save()
	},

	addAceEditor: function( panel ) {
		panel.aceEditor = Ext.amdModules.ace.edit( panel.id )

		var JavaScriptMode = Ext.amdModules.aceModeJavascript.Mode
		panel.aceEditor.getSession().setMode( new JavaScriptMode() )

		panel.aceEditor.setTheme( Ext.amdModules.aceThemePastelOnDark )

		panel.refreshContent()
	},

	refreshAceEditorContent: function( panel ) {
		panel.refreshContent()
	},

    removeScript: function( scriptId ) {
        var editorTab = Ext.getCmp("ScriptEditor"),
			Script = this.getScriptModel()

        Script.load(
            scriptId,
            {
                scope: this,
                success: function( script ) {
                    this.application.closeOpenedTabs( editorTab, script.get('name') )
                    script.destroy()
					this.refreshStores()
                }
            }
        )
    },

    openScriptHelper: function( treePanel, record ) {
        if( !record.data.leaf ) return

		this.openScript( record.getId() )
    },

	openScript: function( scriptId ) {
		var scriptEditor = Ext.getCmp('ScriptEditor'),
			script       = this.getScriptScriptsStore().findRecord( 'path', scriptId ),
			Script 		 = this.getScriptModel()

		if( script ) {
			var foundTab = this.application.findActiveTabByTitle( scriptEditor, script.get('name') )

			if( foundTab )
				return foundTab
		}

		Script.load( scriptId, {
			scope: this,
			success: function( script ) {

				var View = this.getScriptEditorView()
				var view = View.create( {
					title: script.get('name'),
					model: script
				} )

				this.application.createTab( scriptEditor, view )
			}
		})
	},

    showCreateScript: function() {
        var View = this.getScriptCreateView()
        var view = new View( )
        view.show()
    },

    createScript: function( button ) {
        var window = button.up( 'window' ),
            form   = window.down('form').getForm(),
            projectName = this.application.getActiveProject().get('name')

        if( form.isValid() ){
            form.submit(
                {
                    params: {
                        projectName: projectName
                    },
                    waitMsg: 'Creating a new Script',
                    success:
                        Ext.bind(
                            function( form, action ) {
                                Ext.Msg.alert('Success', 'Your Script "' + action.result.data.name + '" has been created.')
                                this.refreshStoresAndTreeStores( true )

                                window.close()
                            },
                            this
                        ),
                    failure: function( form, action ) {
                        Ext.Msg.alert('Failed', action.result)
                    }
                }
            )
        }
    },

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showScriptsListContextMenu( e )
    },

	refreshStoresAndTreeStores: function( force ) {
		this.loadTrees( force )

		this.getScriptScriptsStore().load()
	},

	loadTrees: function( force ) {
		if( !this.treeLoaded || force === true ) {
			this.getScriptTreeStore().load( )
			this.treeLoaded = true
		}

		this.getScriptFoldersTreeStore().load( )
    },

    refreshStores: function() {
		this.getScriptScriptsStore().load()
    },

    showScripts : function( ) {
		this.application.hideMainPanels()

        this.loadTrees()

        Ext.getCmp('ScriptEditor').show()
    }
});
