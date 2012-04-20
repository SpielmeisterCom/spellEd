Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    stores: [
       'ZonesTree',
       'Zones'
    ],

    views: [
        'zone.TreeList',
        'zone.Edit',
        'ui.SpelledRendered'
    ],

    init: function() {
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

        var action = m[1];
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

        var entitiesController = this.application.getController('Spelled.controller.Entities')

        var Zone = Ext.ModelManager.getModel('Spelled.model.Zone')

        Zone.load( record.internalId, {
            success: function( result )   {
                entitiesController.showEntitylist( result.get('entities') )
            }
        } )

    },

    editZone: function( zone ) {
        if( !zone.data.leaf ) return

        var mainPanel = Ext.ComponentManager.get( "MainPanel" )

        var Zone = Ext.ModelManager.getModel('Spelled.model.Zone')

        Zone.load( zone.internalId, {
            success: function( result )   {
                var panels = mainPanel.items.items

                //looking for hidden tabs. returning if we found one
                for( var key in panels  ) {
                    if( panels[ key ].title === result.get('name') ) {
                        return mainPanel.setActiveTab( panels[ key ] )
                    }
                }

                var editZone  = mainPanel.add(
                    Ext.create( 'Spelled.view.zone.Edit',  {
                            title: result.get('name'),
                            html:  JSON.stringify( result.get('content'), null, '\t' )
                        }
                    )
                )
                mainPanel.setActiveTab( editZone )
            }
        } )
    },

    renderZone: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var mainPanel = Ext.ComponentManager.get( "MainPanel" )

        var title = record.internalId
        var src   = title

        var panels = mainPanel.items.items

        //looking for hidden tabs. returning if we found one
        for( var key in panels  ) {
            if( panels[ key ].title === title ) {
                return mainPanel.setActiveTab( panels[ key ] )
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

        var editZone  = mainPanel.add(
            spellTab
        )


        mainPanel.setActiveTab( editZone )

    }
});