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
				'globalsave'      : this.saveAllScriptsInTabs,
				'savescriptpanel' : this.saveScriptInPanel,
				scope : this
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
				script   = this.getScriptScriptsStore().findRecord( 'scriptId', scriptId ),
				tree     = this.getScriptsTree(),
				node     = tree.getRootNode().findChild( 'id', script.getId(), true )

			Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Scripts') )

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
		var scriptEditor = Ext.getCmp('ScriptEditor'),
			script       = this.getScriptScriptsStore().getById( scriptId )

		if( script ) {
			var foundTab = this.application.findActiveTabByTitle( scriptEditor, script.get( 'scriptId' ) )

			if( foundTab )
				return foundTab

			var View = this.getScriptEditorView()
			var view = View.create( {
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
				namespace: ( values.folder === 'root' ) ? '' : values.folder,
				type: 'script'
			},
			id = this.application.generateFileIdFromObject( content )

        if( form.isValid() ){
			Spelled.StorageActions.create(
				{ id: id + ".js", content: content },
				function() {
					content.id = id + ".json"
					var script = Script.create( content )

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

    showListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showScriptsListContextMenu( e )
    },

    refreshStores: function() {
		this.getScriptScriptsStore().load()
    },

    showScripts : function( ) {
		this.application.hideMainPanels()

        Ext.getCmp('ScriptEditor').show()
    }
});
