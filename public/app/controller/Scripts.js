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
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
			'scripteditor': {
				activate: this.refreshAceEditorContent,
				render:   this.addAceEditor
			},
            'scriptsnavigator': {
                activate: this.showScripts
            },
            'scriptstreelist': {
                itemdblclick:    this.openScript,
                itemcontextmenu: this.showListContextMenu,
                editclick:       this.showListContextMenu,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'scriptmanager [action="showCreateScript"]' : {
                click: this.showCreateScript
            },
            'createscript button[action="createScript"]' : {
                click: this.createScript
            }
        })
    },

	addAceEditor: function( panel ) {

		panel.aceEditor = ace.edit( panel.id )

		var JavaScriptMode = require("ace/mode/javascript").Mode;
		panel.aceEditor.getSession().setMode( new JavaScriptMode() );

		panel.aceEditor.commands.addCommand({
			name: 'saveCommand',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S'
			},
			exec: function( editor ) {
				panel.model.set( 'content', editor.getSession().getValue() )
				panel.model.save()
			}
		});

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
					this.refreshStoresAndTreeStores()
                }
            }
        )
    },

    openScript: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var scriptEditor = Ext.getCmp('ScriptEditor'),
            title        = record.internalId,
			Script 		 = this.getScriptModel()

        var foundTab = this.application.findActiveTabByTitle( scriptEditor, title )

        if( foundTab )
            return foundTab

        Script.load( record.internalId, {
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
                                this.refreshStoresAndTreeStores()

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

	refreshStoresAndTreeStores: function() {
		this.loadTrees()

		this.getScriptScriptsStore().load()
	},

	loadTrees: function() {
		this.getScriptTreeStore().load( )
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