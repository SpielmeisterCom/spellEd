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
            }
        })
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
                console.log( result )
                entitiesController.showEntitylist( result.get('entities') )
            }
        } )

    },

    openEditor: function( ) {
        if( !record.data.leaf ) return

        var mainPanel = Ext.ComponentManager.get( "MainPanel" )

        var Zone = Ext.ModelManager.getModel('Spelled.model.Zone')

        Zone.load( record.internalId, {
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
                            html:  JSON.stringify( result.get('content') )
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