Ext.require([
    'Ext.direct.*',
    'Ext.data.*',
	'Ext.tree.ViewDragZone'
]);

var apis = [
    '/api'
]

var after = function(times, func) {
    if (times <= 0) return func();
    return function() {
        if (--times < 1) { return func.apply(this, arguments); }
    };
};

Ext.onReady(function() {
	//TODO: find out why i couldn't extend the ViewDragDrop plugin and refactor it
	Ext.override(Ext.tree.ViewDragZone, {
		isPreventDrag: function(e, record) {
			return this.callOverridden(arguments) || !record.isLeaf();
		}
	});

    var lock = after( apis.length, startEditor )

    Ext.each( apis, function( api ) {
            Ext.Ajax.request({
                url: api,
                disableCaching : false,
                success: function( response ){
                    Ext.direct.Manager.addProvider( JSON.parse( response.responseText ) )
                    lock()
                }
            })
        }
    )

})

var startEditor = function() {

    Ext.application({
        name: 'Spelled',

        appFolder: 'app',

        controllers: [
            'Scenes',
            'Entities',
            'Menu',
            'Projects',
            'Components',
            'Assets',
            'Templates',
            'Scripts',
			'Systems',
            'templates.Components',
            'templates.Entities',
            'templates.Systems'
        ],

		stores: [
			'asset.Tree',
			'asset.FoldersTree',
			'asset.Textures',
			'asset.Sounds',
			'script.Scripts',
			'script.Tree',
			'script.FoldersTree',
			'TemplatesTree',
			'template.FoldersTree'
		],

		refs: [
			{
				ref : 'MainPanel',
				selector: '#MainPanel'
			},
			{
				ref: 'RightPanel',
				selector: '#RightPanel'
			}
		],

        project: undefined,
        scene: undefined,

		showDocumentation: function( docString ) {
			if( Ext.isObject( this.configuration ) ) {
				var docPath = this.configuration.documentationServerURL + docString
				window.open( docPath, '_blank')
			}
		},

		showBuildServerConnectError: function() {
			Ext.Msg.alert( 'Service unavailable', "SpellEd can't connect to the Build-Server." )
		},

		getLastSelectedNode: function( treePanel ) {
			return treePanel.getSelectionModel().getLastSelected()
		},

		removeSelectedNode: function( treePanel, callback ) {
			this.getLastSelectedNode( treePanel ).remove()
		},

        createTab: function( tabPanel, view ) {

            var newPanel  = tabPanel.add(
                view
            )

            tabPanel.setActiveTab( newPanel )

            return newPanel
        },

		closeAllTabs: function( tabPanel ) {
			tabPanel.items.each(
				function( tab ) {
					tab.destroy()
				}
			)
		},

		closeOpenedTabs: function( tabPanel, title ) {
            tabPanel.items.each(
                function( tab ) {
                    if( tab.title === title ) {
                        tab.destroy()
                    }
                }
            )
        },

        findActiveTabByTitle: function( tabPanel, title ) {
            var foundPanel = undefined

            //looking for hidden tabs. returning if we found one
            tabPanel.items.each(
                function( panel ) {
                    if( panel.title === title ) {
                        foundPanel = panel
                        tabPanel.setActiveTab( foundPanel )
                        return foundPanel
                    }
                }
            )

            return foundPanel
        },

		hideMainPanels: function() {
			this.getRightPanel().hide()

			this.getMainPanel().items.each(
				function( panel ) {
					panel.hide()
				}
			)
		},

        hideActions: function( view, list, node, rowIndex, e ) {
            var icons = Ext.DomQuery.select('.x-action-col-icon', node)
            Ext.each( icons, function( icon ){
                Ext.get( icon ).addCls( 'x-hidden' )
            })
        },

        showActionsOnLeaf: function( view, list, node, rowIndex, e ) {
            this.application.showActions( true, view, list, node, rowIndex, e )
        },

        showActionsOnFolder: function( view, list, node, rowIndex, e ) {
            this.application.showActions( false, view, list, node, rowIndex, e )
        },

        showActions: function( showOnLeaf, view, list, node, rowIndex, e ) {
            var icons = Ext.DomQuery.select('.edit-action-icon', node),
                node  = view.getRecord( node )

            if( node.isLeaf() === showOnLeaf && !node.isRoot() ) {
                this.showActionColumnIcons( icons )
            }
        },

		showActionColumnIcons: function( icons ) {
			Ext.each(
				icons,
				function(icon){
					Ext.get(icon).removeCls('x-hidden')
				}
			)
		},

        getActiveProject: function() {
            return this.project
        },

        setActiveProject: function( project ) {
            Ext.state.Manager.set( 'projectName', project.get('name') )
            this.project = project
        },

        getActiveScene: function() {
            return this.scene
        },

        setActiveScene: function( scene ) {
            this.scene = scene
        },

		setExtraParamOnProxies: function( name, value ) {
			Ext.each(
				this.stores,
				function( storeId ) {
					Ext.getStore( storeId ).getProxy().setExtraParam( name, value )
				}
			)
		},

        launch: function() {
			var me = this

			Ext.Ajax.request({
				url: 'configuration.json',
				success: function( response ){
					me.configuration = Ext.decode( response.responseText, true)
				}
			})


            Ext.get('loading').remove()
            Ext.get('loading-mask').fadeOut( {
                remove: true
            } )

            Ext.create('Spelled.view.ui.SpelledViewport')

            var stateProvider = undefined
            try {
                stateProvider = Ext.create( 'Ext.state.LocalStorageProvider' )
            } catch( e ) {
                console.log( "Browser does not support local storage. Fallback to Cookie storage" )
                stateProvider = Ext.create( 'Ext.state.CookieProvider')
            }

            Ext.state.Manager.setProvider( stateProvider )

            var projectName = Ext.state.Manager.get( 'projectName' )

            //TODO: what if the project is deleted?
            try {
                this.getController('Projects').loadProject( projectName )
            } catch( e ) {
                Ext.state.Manager.clear( 'projectName' )
                Ext.create( 'Spelled.view.ui.StartScreen').show()
            }

        }
    })
}
