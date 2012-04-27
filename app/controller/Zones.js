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
        'zone.Editor',
        'ui.SpelledRendered'
    ],

    init: function() {

        var dispatchPostMessages = function( event ) {

            if ( event.origin !== location.href ){
                console.log( "WRONG produced origin!")
                //return;
            }

            if( event.data.action === 'getConfiguration' ) {

                var cmp = Ext.getCmp( event.data.extId )

                var zone = Ext.getStore('config.Zones').getById( cmp.zoneId )

                cmp.el.dom.contentWindow.postMessage( {
                    id: cmp.id,
                    type: "setConfiguration",
                    data: zone.getJSONConfig()
                }, location.href )

            }
        }

        window.addEventListener("message", dispatchPostMessages, false);


        this.control({
            '#ZonesTree': {
                itemclick   : this.getEntityList,
                itemdblclick: this.renderZone
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
            'zonetreelist actioncolumn': {
                click: this.handleActionColumnClick
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

    handleActionColumnClick: function( view, cell, rowIndex, colIndex, e ) {
        var m = e.getTarget().className.match(/\bact-(\w+)\b/)
        if (m === null || m === undefined) {
            return
        }

        var zone = view.store.data.items[ rowIndex ]
        if( zone.data.leaf === false ) return

        var action = m[1]
        switch ( action ) {
            case 'newZone':
                this.createNewZone( zone )
                break;
            case 'deleteZone':
                this.deleteZone( zone )
                break;
            case 'editZone':
                this.editZone( zone )
                break;
        }

    },

    createNewZone: function( zone ) {
        console.log( "Creating new Zone")
    },

    deleteZone: function( zone ) {
        console.log( "deleting zone" )
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

        var entitiesController = this.application.getController('Spelled.controller.Entities')
        entitiesController.showEntitylist( zone.getEntities() )

    },

    editZone: function( zone ) {
        if( !zone.data.leaf ) return

        var zoneEditor = Ext.getCmp('ZoneEditor')

        var zone = this.getConfigZonesStore().getById( zone.internalId )

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
                    html:  JSON.stringify( zone.data, null, '\t' )
                }
            )
        )
        zoneEditor.setActiveTab( editZone )

    },

    renderZone: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var zoneEditor = Ext.getCmp( "ZoneEditor" )

        var title = "Rendered: " + record.internalId

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

        iframe.zoneId = record.internalId

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
        };

        var zonesPanel = Ext.ComponentManager.get( "ZonesTree" )
        zonesPanel.getStore().setRootNode( rootNode )
    }
});