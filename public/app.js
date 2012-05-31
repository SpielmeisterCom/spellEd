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
    // Ext overrides. Needed because some functionality isn't implemented yet by Sencha
    Ext.override( Ext.data.Store, {
        loadDataViaReader : function(data, append) {
            var me      = this,
                result  = me.proxy.reader.read(data),
                records = result.records;

            me.loadRecords(records, { addRecords: append })
            me.fireEvent('load', me, result.records, true)
        }
    })

    Ext.override(Ext.data.TreeStore, {

        hasFilter: false,

        filter: function(filters, value) {

            if (Ext.isString(filters)) {
                filters = {
                    property: filters,
                    value: value
                };
            }

            var me = this,
                decoded = me.decodeFilters(filters),
                i = 0,
                length = decoded.length;

            for (; i < length; i++) {
                me.filters.replace(decoded[i]);
            }

            Ext.Array.each(me.filters.items, function(filter) {
                Ext.Object.each(me.tree.nodeHash, function(key, node) {
                    if (filter.filterFn) {
                        if (!filter.filterFn(node)) node.remove();
                    } else {
                        if (node.data[filter.property] != filter.value) node.remove();
                    }
                });
            });
            me.hasFilter = true;
        },

        clearFilter: function() {
            var me = this;
            me.filters.clear();
            me.hasFilter = false;
            me.load();
        },

        isFiltered: function() {
            return this.hasFilter;
        }

    });

    //Overrides finished

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
            'blueprints.Components',
            'blueprints.Entities',
            'blueprints.Systems'
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