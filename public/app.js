Ext.require([
    'Ext.direct.*',
    'Ext.data.*'
]);

var apis = [
    '/api',
    'http://localhost:8080/api'
]

var after = function(times, func) {
    if (times <= 0) return func();
    return function() {
        if (--times < 1) { return func.apply(this, arguments); }
    };
};

Ext.onReady(function() {
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
            'Zones',
            'Entities',
            'Menu',
            'Projects',
            'Components',
            'Assets',
            'Blueprints',
            'Scripts',
            'blueprints.Components',
            'blueprints.Entities',
            'blueprints.Systems'
        ],

		stores: [
			'asset.Tree',
			'asset.FoldersTree',
			'asset.Textures',
			'asset.Sounds',
			'script.Scripts',
			'script.Tree',
			'script.FoldersTree',
			'BlueprintsTree',
			'blueprint.FoldersTree',
		],

		refs: [
			{
				ref : 'MainPanel',
				selector: '#MainPanel'
			}
		],

        project: undefined,
        zone: undefined,

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
            var icons = Ext.DomQuery.select('.x-action-col-icon', node),
                node  = view.getRecord( node )

            if( node.isLeaf() === showOnLeaf && !node.isRoot() ) {
                Ext.each(
                    icons,
                    function(icon){
                        Ext.get(icon).removeCls('x-hidden')
                    }
                )
            }
        },

        getActiveProject: function() {
            return this.project
        },

        setActiveProject: function( project ) {
            Ext.state.Manager.set( 'projectName', project.get('name') )
            this.project = project
        },

        getActiveZone: function() {
            return this.zone
        },

        setActiveZone: function( zone ) {
            this.zone = zone
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