Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    stores: [
       'ZonesTree',
       'Zones'
    ],

    views: [
        'zone.TreeList',
        'zone.Edit'
    ],

    init: function() {
        this.control({
            '#ZonesTree': {
                itemclick   : this.getEntityList,
                itemdblclick: this.renderZone
            }
        })
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
                    Ext.create( 'Spelled.view.ui.SpelledRendered',  {
                              title: result.get('name'),
                              autoEl : {
                                  tag : "iframe",
                                  height: '100%',
                                  width : '100%',
                                  src : result.get('name')
                              }
                          }
                      )
                )
                mainPanel.setActiveTab( editZone )
            }
        } )

    }
});