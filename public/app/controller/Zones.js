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
        },
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
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

	TREE_ITEM_TYPE_ZONE   : 1,
	TREE_ITEM_TYPE_ENTITY : 2,
	TREE_ITEM_TYPE_SYSTEM : 3,
	TREE_ITEM_TYPE_SCRIPT : 4,

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
				select         : me.dispatchTreeClick,
                itemcontextmenu: me.dispatchTreeListContextMenu,
				editclick    :   me.dispatchTreeListContextMenu,
                itemmouseenter : me.dispatchMouseEnterTree,
                itemmouseleave : me.application.hideActions
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

	getClickedTreeItemType: function( record ) {
		var type = undefined

		switch( record.get('iconCls') ) {
			case 'tree-zone-icon':
	            type = this.TREE_ITEM_TYPE_ZONE
				break
			case 'tree-zone-entity-icon':
				type = this.TREE_ITEM_TYPE_ENTITY
				break
			case 'tree-zone-system-icon':
				type = this.TREE_ITEM_TYPE_SYSTEM
				break
			case 'tree-zone-script-icon':
				type =  this.TREE_ITEM_TYPE_SCRIPT
				break
		}

		return type
	},

	dispatchTreeListContextMenu: function( gridView, list, columnIndex, rowIndex, e ) {
		var node = gridView.getRecord( gridView.findTargetByEvent(e) )

		switch( this.getClickedTreeItemType( node ) ) {
			case this.TREE_ITEM_TYPE_ZONE:
				this.showListContextMenu( gridView, list, node, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.getController( 'Entities').showListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
		}
	},

	dispatchMouseEnterTree: function( view, list, node, rowIndex, e  ) {
		var icons  = undefined,
			record = view.getRecord( node )

		switch( this.getClickedTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_ENTITY:
			case this.TREE_ITEM_TYPE_ZONE:
				icons = Ext.DomQuery.select( '.edit-action-icon', node)
				break
		}

		this.application.showActionColumnIcons( icons )
	},

	dispatchTreeClick: function( treePanel, record ) {
		this.getRightPanel().removeAll()

		switch( this.getClickedTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_ZONE:
				var zone = this.getConfigZonesStore().getById( record.getId() )
				if( zone ) {
					this.application.setActiveZone( zone )
				}
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.getController('Entities').showEntityInfo( record.getId() )
				break
			case this.TREE_ITEM_TYPE_SYSTEM:
				var zone = this.getConfigZonesStore().getById( record.parentNode.getId() )
				if( zone ) {
					this.application.setActiveZone( zone )
					this.application.getController('Systems').refreshZoneSystemList( zone )
				}
				break
			case this.TREE_ITEM_TYPE_SCRIPT:
				var zone = this.getConfigZonesStore().getById( record.parentNode.getId() )
				if( zone ) {
					this.application.setActiveZone( zone )
					this.refreshZoneScriptCombobox( zone )
				}
				break
		}
	},

	refreshZoneScriptCombobox: function( zone ) {
		var contentPanel = this.getRightPanel(),
			View = this.getZoneScriptView(),
			view = new View(),
			combobox = view.down( 'combobox' )

		combobox.select( zone.get('scriptId') )

		contentPanel.add( view )
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

    showZonesEditor: function() {
		this.application.hideMainPanels()
		this.getRightPanel().show()

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
            zones  = project.getZones(),
			store  = this.getConfigZonesStore()

        record.set( values )

		store.add( record )
		zones.add( record )
        this.showZonesList( zones )

        window.close()
    },

    showListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showZonesListContextMenu( e )
    },

    deleteZone: function( zone ) {
        var project = this.application.getActiveProject(),
            zones   = project.getZones(),
			zoneEditor = Ext.getCmp('ZoneEditor')

        zones.remove( zone )
		this.application.closeOpenedTabs( zoneEditor, zone.getRenderTabTitle() )
		this.application.closeOpenedTabs( zoneEditor, zone.getSourceTabTitle() )
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

    showZonesList: function( zones ) {
        var tree     = Ext.ComponentManager.get( "ZonesTree"),
            rootNode = tree.getStore().getRootNode()
        rootNode.removeAll()

        zones.each( function( zone ) {
            zone.appendOnTreeNode( rootNode )
        })
    }
});
