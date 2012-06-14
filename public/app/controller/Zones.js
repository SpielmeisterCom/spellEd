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
        'zone.Create',
        'zone.Editor',
		'zone.Script',
        'ui.SpelledRendered'
    ],

	BUILD_SERVER_ORIGIN : 'http://localhost:8080',

    init: function() {
		var me = this

        var dispatchPostMessages = function( event ) {

			switch ( event.data.action ) {
				case 'spell.initialized' :
					me.answerIframePostMessage( event, "run" )
					return
			}
        }

        window.addEventListener("message", dispatchPostMessages, false);

        this.control({
            '#ZonesTree': {
                select      : me.getEntityList,
                itemdblclick: me.renderZoneHelper
            },
			'renderedzone': {
				show: function( panel ) {
					panel.down( 'spellediframe').focus()
				}
			},
			'renderedzone > toolbar button[action="saveZone"]': {
                click: me.saveZone
            },
            'renderedzone > toolbar button[action="reloadZone"]': {
                click: me.reloadZone
            },
            'renderedzone > toolbar button[action="toggleState"]': {
                click: me.toggleState
            },
            'zonetreelist': {
                itemcontextmenu: me.showListContextMenu,
                deleteclick:     me.deleteZoneActionIconClick,
                itemmouseenter:  me.application.showActionsOnLeaf,
                itemmouseleave:  me.application.hideActions
            },
            'zonetreelist button[action="showCreateZone"]': {
                click: me.showCreateZone
            },
            'createzone button[action="createZone"]' : {
                click: me.createZone
            },
            'createzone button[action="createZone"]' : {
                click: me.createZone
            },
            'zonesnavigator': {
                activate: me.showZonesEditor
            },
			'zonescript > combobox[name="scriptId"]' : {
				select: this.setZoneScript
			}
        })
    },

	refreshZoneScriptCombobox: function( scriptId ) {
		var combobox = Ext.getCmp('ZoneScript').down( 'combobox' )

		combobox.select( scriptId )
	},

	setZoneScript: function( combo, records ) {
		var zone = this.application.getActiveZone()

		zone.set('scriptId', combo.getValue())
	},

	checkOrigin: function( event ) {
		if ( event.origin !== this.BUILD_SERVER_ORIGIN ){
			console.log( 'event.origin: ' + event.origin )
			console.log( 'Error: origin does not match.' )

			return false
		}

		return true
	},

	sendKeyEventToIframe: function( event ) {
		var data = {
			type: "keyEvent",
			payload: {
				type: event.type,
				keyCode: event.keyCode
			}
		}

		this.sendIframePostMessage( this.activeIframeId, "debug", data )
	},

	answerIframePostMessage: function( event, type, options ) {
		if( !this.checkOrigin( event ) ) return

		this.sendIframePostMessage( event.data.iframeId, type, options )
	},

	sendIframePostMessage: function( iFrameId, type, options ) {
		var cmp    = Ext.getCmp( iFrameId ),
			config = ( Ext.isObject( options ) ) ? options : {}

		if( !cmp ) return

		config.type 	= "spelled." + type
		config.iframeId = cmp.id

		cmp.el.dom.contentWindow.postMessage(
			config,
			this.BUILD_SERVER_ORIGIN
		)
	},

    deleteZoneActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        var zone = Ext.getStore('config.Zones').getById( node.get('id') )

        if( !zone ) return

        this.deleteZone( zone )
    },

    showZonesEditor: function() {
		this.application.hideMainPanels()

        Ext.getCmp('ZoneEditor').show()
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
            var menuController = this.application.getController('Menu')
            menuController.showZonesListContextMenu( e )
        }
    },

    deleteZone: function( zone ) {
        var project = this.application.getActiveProject(),
            zones   = project.getZones(),
			zoneEditor = Ext.getCmp('ZoneEditor')

        zones.remove( zone )
		this.application.closeOpenedTabs( zoneEditor, zone.getRenderTabTitle() )
		this.application.closeOpenedTabs( zoneEditor, zone.getSourceTabTitle() )

        this.showZoneslist( zones )
    },

    reloadZone: function( button ) {
        var panel   = button.up('panel'),
            project = this.application.getActiveProject(),
            iframe  = panel.down( 'spellediframe' )

        SpellBuild.ProjectActions.executeCreateDebugBuild(
            "html5",
            project.get('name'),
            project.getConfigName(),
            function() {
                iframe.el.dom.src = iframe.el.dom.src
				iframe.focus()
			}
        )

    },

    toggleState: function( button ) {
        console.log( "should toggle play/pause")
    },

    saveZone: function( button ) {
        console.log( "Should save the content ")
    },

    getEntityList: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var zone = this.getConfigZonesStore().getById( record.getId() )

        if( zone ) {
            this.application.setActiveZone( zone )

            this.application.getController('Entities').showEntitylist( zone.getEntities() )
			this.application.getController('Systems').refreshZoneSystemList( zone )
			this.refreshZoneScriptCombobox( zone.get('scriptId') )
        }
    },

    renderZoneHelper: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var zone = this.getConfigZonesStore().getById( record.getId() )

        this.renderZone( zone )
    },

    renderZone: function( zone ) {
        var zoneEditor = Ext.getCmp( "ZoneEditor"),
            title = zone.getRenderTabTitle()

        var foundTab = this.application.findActiveTabByTitle( zoneEditor, title )

        if( foundTab )
            return foundTab

        var spellTab = Ext.create( 'Spelled.view.ui.SpelledRendered', {
                title: title
            }
        )

        var project = this.application.getActiveProject()

        var createTab = function( provider, response ) {

            var iframe = Ext.create( 'Spelled.view.ui.SpelledIframe', {
                projectName: project.get('name'),
				zoneId: zone.getId()
            })

            spellTab.add( iframe )

            this.application.createTab( zoneEditor, spellTab )
		}

        SpellBuild.ProjectActions.executeCreateDebugBuild(
            "html5",
            project.get('name'),
            project.getConfigName(),
            Ext.bind( createTab, this )
        )

    },

    showZoneslist: function( zones ) {
        var tree     = Ext.ComponentManager.get( "ZonesTree"),
            rootNode = tree.getStore().getRootNode()
        rootNode.removeAll()

        zones.each( function( zone ) {
            rootNode.appendChild(
                rootNode.createNode( {
                        text      : zone.getId(),
                        id        : zone.getId(),
                        leaf      : true
                    }
                )
            )
        })

        if( rootNode.hasChildNodes( ) ) {
            tree.getSelectionModel().select( rootNode.firstChild  )
        }
    }
});
