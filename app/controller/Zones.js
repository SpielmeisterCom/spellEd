Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    models: [
        'config.Zone'
    ],

    stores: [
       'ZonesTree',
       'config.Zones'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    views: [
        'zone.TreeList',
        'zone.Navigator',
        'zone.Edit',
        'zone.Create',
        'zone.Editor',
        'ui.SpelledRendered'
    ],

    init: function() {

        var dispatchPostMessages = function( event ) {
				var buildServerOrigin = 'http://localhost:8080'

            if ( event.origin !== buildServerOrigin ){
                console.log( 'event.origin: ' + event.origin )
                console.log( 'Error: origin does not match.' )

                return
            }

            if( event.data.action === 'getConfiguration' ) {

                var cmp = Ext.getCmp( event.data.extId )

                var zone = Ext.getStore('config.Zones').getById( cmp.zoneId )

                var entities = []
                var components = []


                Ext.getStore('blueprint.Entities').each(
                    function( record ) {
                        entities.push( record.data )
                    }
                )

                Ext.getStore('blueprint.Components').each(
                    function( record ) {
                        var result = record.data
                        var attributes = []

                        Ext.each( record.getAttributes().data.items, function( attribute ) {
                            attributes.push( attribute.data )
                        } )

                        result.attributes = attributes
                        components.push( result )
                    }
                )

                var result = {
                    zone: zone.getJSONConfig(),
                    entityBlueprints: entities,
                    componentBlueprints: components
                }

                cmp.el.dom.contentWindow.postMessage(
						{
                    id: cmp.id,
                    type: "setConfiguration",
                    data: result
                	},
						buildServerOrigin
						)

            }
        }

        window.addEventListener("message", dispatchPostMessages, false);


        this.control({
            '#ZonesTree': {
                select      : this.getEntityList,
                itemdblclick: this.renderZoneHelper
            },
            'renderedzone > toolbar button[action="saveZone"]': {
                click: this.saveZone
            },
            'renderedzone > toolbar button[action="reloadZone"]': {
                click: this.reloadZone
            },
            'renderedzone > toolbar button[action="toggleState"]': {
                click: this.toggleState
            },
            'zonetreelist': {
                itemcontextmenu: this.showListContextMenu
            },
            'zonetreelist button[action="showCreateZone"]': {
                click: this.showCreateZone
            },
            'createzone button[action="createZone"]' : {
                click: this.createZone
            },
            'createzone button[action="createZone"]' : {
                click: this.createZone
            },
            'zonesnavigator': {
                activate: function() {
                    var mainPanel = this.getMainPanel()

                    Ext.each( mainPanel.items.items, function( panel ) {
                        panel.hide()
                    })

                    Ext.getCmp('ZoneEditor').show()
                }
            }
        })
    },

    showCreateZone: function( ) {
        var View  = this.getZoneCreateView(),
            Model = this.getConfigZoneModel()

        var view = new View()
        view.down('form').loadRecord( new Model() )

        view.show()
    },

    createZone: function ( button ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            project= this.application.getActiveProject(),
            zones  = project.getZones()

        record.set( values )
        zones.add( record )

        this.showZoneslist( zones )
        window.close()
    },

    showListContextMenu: function( view, record, item, index, e, options ) {
        e.stopEvent()

        if( record.data.leaf ) {
            var menuController = this.application.getController('Spelled.controller.Menu')
            menuController.showZonesListContextMenu( e )
        }
    },

    deleteZone: function( zone ) {
        var project = this.application.getActiveProject(),
            zones   = project.getZones()

        zones.remove( zone )

        this.showZoneslist( zones )
    },

    reloadZone: function( button ) {
        var panel  = button.up('panel'),
            iframe = panel.down( 'spellediframe' )

        iframe.el.dom.src = iframe.el.dom.src
    },

    toggleState: function( button ) {
        console.log( "should toggle play/pause")
    },

    saveZone: function( button ) {
        console.log( "Should save the content ")
    },

    getEntityList: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var zone = this.getConfigZonesStore().getById( record.internalId )

        this.application.setActiveZone( zone )

        var entitiesController = this.application.getController('Spelled.controller.Entities')
        entitiesController.showEntitylist( zone.getEntities() )

    },

    editZone: function( zone ) {
        var zoneEditor = Ext.getCmp('ZoneEditor')

        var panels = zoneEditor.items.items

        var title = "Source: " + zone.getId()

        //looking for hidden tabs. returning if we found one
        for( var key in panels  ) {
            if( panels[ key ].title === title ) {
                return zoneEditor.setActiveTab( panels[ key ] )
            }
        }

        var editZone  = zoneEditor.add(
            Ext.create( 'Spelled.view.zone.Edit',  {
                    title: title,
                    html:  JSON.stringify( zone.getJSONConfig(), null, '\t' )
                }
            )
        )
        zoneEditor.setActiveTab( editZone )

    },

    renderZoneHelper: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var zone = this.getConfigZonesStore().getById( record.internalId )

        this.renderZone( zone )
    },

    renderZone: function( zone ) {
        var zoneEditor = Ext.getCmp( "ZoneEditor" )

        var title = "Rendered: " + zone.internalId

        var panels = zoneEditor.items.items

        //looking for hidden tabs. returning if we found one
        for( var key in panels  ) {
            if( panels[ key ].title === title ) {
                return zoneEditor.setActiveTab( panels[ key ] )
            }
        }

        var spellTab = Ext.create( 'Spelled.view.ui.SpelledRendered', {
                title: title
            }
        )

        var iframe = Ext.create( 'Spelled.view.ui.SpelledIframe')

        iframe.zoneId = zone.internalId

        spellTab.add(
            iframe
        )

        var editZone  = zoneEditor.add(
            spellTab
        )


        zoneEditor.setActiveTab( editZone )

    },

    showZoneslist: function( zones ) {

        var children = []
        Ext.each( zones.data.items, function( zone ) {
            children.push( {
                text      : zone.getId(),
                id        : zone.getId(),
                leaf      : true
            } )
        })

        var rootNode = {
            text: "Zones",
            expanded: true,
            children: children
        }

        var zonesPanel = Ext.ComponentManager.get( "ZonesTree" )
        zonesPanel.getStore().setRootNode( rootNode )
    }
});
