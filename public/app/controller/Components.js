Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.component.Properties',
		'Spelled.view.component.property.AssetId',
		'Spelled.view.component.Add',
		'Spelled.view.component.AddButton',
		'Spelled.model.config.Component',
		'Spelled.store.config.Components'
	],

    views: [
        'component.Properties',
		'component.property.AssetId',
		'component.Add',
		'component.AddButton'
    ],

    models: [
        'config.Component'
    ],

    stores: [
       'config.Components'
    ],

	refs: [
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'SceneEditor',
			selector: '#SceneEditor'
		}
	],

	init: function() {
		this.control({
			//TODO: find out why the selector 'componentproperties field' doesn't work!
			'field': {
				editproperty: this.previewAttributeChange
			},
			'componentproperties': {
				edit: this.editProperty,
				canceledit: this.cancelPropertyEdit,
				beforeclose: this.confirmDelete
			},
			'componentproperties tool-documentation': {
				showDocumentation: this.showDocumentation
			},
			'entitycomponentslist button[action="showAddComponent"]': {
				click: this.showAddComponent
			},
			'entitycomponentslist': {
				afterlayout: this.showAddComponentButton
			},
			'addcomponent button[action="addComponent"]': {
				click : this.addComponent
			}

		})
	},

	cancelPropertyEdit: function( editor, e ) {
		var value  = e.value,
			column = e.column

		this.previewAttributeChange( column, value, value )
	},

	showDocumentation: function( docString, toolEl, panel ) {
		var componentGrid = panel.up( 'componentproperties' )

		if( !!componentGrid.componentConfigId ) {
			var component = Ext.getStore( 'config.Components' ).getById( componentGrid.componentConfigId ),
				template  = component.getTemplate()

			if( template ) {
				this.application.showDocumentation( "#!/guide/" + template.getDocumentationName() )
			}
		}
	},

	showAddComponentButton: function( panel ) {
		if( !this.addingButton ) {
			this.addingButton = true

			var cmp = panel.down( 'addcomponentbutton' )
			if( !!cmp ) panel.remove( cmp )

			panel.add( Ext.widget( 'addcomponentbutton' ) )

			this.addingButton = false
		}
	},

	confirmDelete: function( panel ) {
		var title = panel.title

		if( !!panel.removeAllowed )
			return true
		else {
			Ext.Msg.confirm(
				'Remove '+ title,
				'Should the Component: "' + title + '" be removed?',
				function( button ) {
					if ( button === 'yes' ) {
						this.removeComponent( panel )
						panel.removeAllowed = true
						panel.close()
					}
				},
				this
			)

			return false
		}
	},

	removeComponent: function( panel ) {
		var store     = this.getConfigComponentsStore(),
			component = store.getById( panel.componentConfigId ),
			entity    = component.getEntity()

		entity.getComponents().remove( component )
		entity.setDirty()
		store.remove( component )
	},

	showAddComponent: function( button ) {
		var view   = Ext.widget( 'addcomponent' ),
			entity = button.up('entitycomponentslist').entity,
			availableComponentsView = view.down( 'treepanel' ),
			templateComponentsStore = Ext.getStore( 'template.Components' )


		var rootNode = availableComponentsView.getStore().setRootNode( {
				text: 'Components',
				expanded: true
			}
		)

		var notAssignedComponents = Ext.create( 'Ext.util.MixedCollection' )

		templateComponentsStore.each(
			function( record ) {
				var found = entity.getComponents().find( 'templateId', record.getFullName() )

				if( found === -1 ) {
					notAssignedComponents.add( record )
				}
			}
		)

		notAssignedComponents = notAssignedComponents.filterBy(
			function( item ) {
				return !item.isEngineInternal()
			}
		)

		var sortHelper = function( model1, model2, field ) {
			var model1SortOrder = model1.get( field ),
				model2SortOrder = model2.get( field )

			if( !model2SortOrder && model1SortOrder ) return -1
			if( !model1SortOrder && model2SortOrder ) return 1
			if ( model1SortOrder === model2SortOrder) return 0

			return model1SortOrder < model2SortOrder ? -1 : 1
		}

		notAssignedComponents.sortBy(
			function( item1, item2 ) {
				var result = sortHelper( item1, item2, 'title' )

				if( result === 0 ) {
					return sortHelper( item1, item2, 'templateId' )
				} else return result
			}
		)

		this.appendComponentsAttributesOnTreeNode( rootNode, notAssignedComponents )

		rootNode.eachChild(
			function( node ) {
				node.set('checked', false)
			}
		)

		view.entity = entity

		view.show()
	},

	appendComponentsAttributesOnTreeNode: function( node, components ) {

		components.each(
			function( component ) {

				var componentTemplate = ( !component.get('templateId') ) ?
					component :
					Ext.getStore( 'template.Components' ).getByTemplateId( component.get('templateId') )

				if( componentTemplate ) {
					var text = ( Ext.isEmpty( componentTemplate.get('title') ) ) ? componentTemplate.getFullName() : componentTemplate.get('title') + " (" + componentTemplate.getFullName() + ")",
						config = {
							text      : text,
							id        : component.getId(),
							leaf      : false
						}

					if( !Ext.isEmpty( componentTemplate.get('icon') ) ) config.icon = componentTemplate.get( 'icon' )
					else config.iconCls = "tree-component-icon"

					var newNode = node.createNode ( config )

					componentTemplate.appendOnTreeNode( newNode )

					node.appendChild( newNode )
				}
			}
		)

		return node
	},

	addComponent: function( button ) {
		var window = button.up('window'),
			tree   = window.down('treepanel'),
			form   = window.down('form'),
			records= tree.getView().getChecked(),
			Model  = this.getConfigComponentModel(),
			componentTemplateStore = Ext.getStore('template.Components'),
			entity = window.entity

		this.getRightPanel().removeAll()

		Ext.each(
			records,
			function( record ) {
				entity.setDirty()

				var componentTemplate = componentTemplateStore.getById( record.get('id') )

				if( componentTemplate ) {
					var configComponent = new Model( {
						templateId : componentTemplate.getFullName(),
						additional: true
					})

					configComponent.setEntity( entity )

					entity.getComponents().add( configComponent )
				}
			}
		)

		if( entity.modelName === "Spelled.model.template.Entity" || entity.isTemplateComposite() )
			this.application.getController('templates.Entities').showEntityTemplateComponentsList( entity )
		else
			this.application.getController('Entities').showComponentsList( entity )

		window.close()
	},

	editProperty: function( editor, e ) {
		var componentConfigId = e.grid.componentConfigId,
			record            = e.record,
			component         = this.getConfigComponentsStore().getById( componentConfigId ),
			config            = Ext.Object.merge( {}, component.get('config') ),
			defaultConfig     = component.getConfigMergedWithTemplateConfig(),
			value             = Ext.decode( record.get( 'value'), true ) || record.get( 'value'),
			name              = record.get('name'),
			entity            = component.getEntity()

		if( config[ name ] != value ) {
			config[ name ] = value

			if( config[ name ] == defaultConfig[ name ] ) {
				delete config[ name ]
			}

			component.set( 'config', config)
			component.setChanged()

			entity.setDirty()
		}
	},

	convertValueForGrid: function( value ) {
		if( Ext.isArray( value ) === true ) {
			return "[" + value.toString() + "]"
		} else if( Ext.isObject( value ) ) {
			return Ext.encode( value )
		} else {
		    return value
		}
	},

	createPropertyFromAttribute: function ( attribute, name, value ) {
		var typeName      = attribute.get( 'type' ),
			attributeType = this.getStore( 'template.component.AttributeTypes' ).findRecord( 'name', typeName )

		return {
			type: attributeType.get('type'),
			value: this.convertValueForGrid( value ),
			componentValue: value,
			values : attribute.get('values')
		}
	},

	createConfigGridView: function( component ) {
        var config   = {},
			template = component.getTemplate(),
			title    = ( Ext.isEmpty( template.get('title') ) ) ? component.get('templateId') : template.get('title')

        Ext.iterate(
            component.getConfigMergedWithTemplateConfig(),
            function( key, value ) {
				config[ key ] = this.createPropertyFromAttribute( template.getAttributeByName( key ), key, value )
            },
            this
        )

		var icon     = ( Ext.isEmpty( template.get('icon') ) )? "" : "style='background: url(" + template.get('icon') +") no-repeat;'",
			iconClass   = ( component.get('additional') ) ? "component-icon" : "linked-component-icon",
			linkedImage = ( !component.get('additional') && !Ext.isEmpty( template.get('icon') ) ) ? "<img src='/images/icons/link.png' style='margin-left: -18px;'/>" : "<span/>"

		return Ext.widget(
			'componentproperties',
			{
				title: "<span class='"+ iconClass +"' "+ icon +">" + linkedImage +"</span> <span>" + title +"</span>",
				isAdditional: component.get('additional'),
				source: config,
				componentConfigId: component.getId()
			}
		)
    },

	getComponentScene: function( component ) {
		var getScene = function( entity ) {
			if( !entity.getOwner ) return

			var owner = entity.getOwner()
			return ( entity.hasScene() ? owner : getScene( owner ) )
		}

		return getScene( component.getEntity() )
	},

	previewAttributeChange: function( field, newValue, oldValue ) {
		var activeScene       = this.application.getActiveScene(),
			sceneController   = this.application.getController( 'Scenes'),
			sceneEditor       = this.getSceneEditor(),
			view              = field.up('componentproperties')
		//Workaround because of the bad control-query in this controller
		if( !view ) return

		var	component         = this.getConfigComponentsStore().getById( view.componentConfigId ),
			name              = view.getSelectionModel().getLastSelected().get('name')

		if ( this.getComponentScene( component ) != activeScene ) return

		if ( activeScene && sceneEditor.isVisible() ) {
			var activeSceneTab = this.application.findActiveTabByTitle( sceneEditor, activeScene.getRenderTabTitle() )

			if( activeSceneTab && activeSceneTab.isVisible() ) {
				var componentConfig = {}

				componentConfig[ name ] = Ext.decode( newValue, true ) || newValue

				sceneController.engineMessageBus.send(
					activeSceneTab.down( 'spellediframe' ).getId(),
					{
						type : 'spelled.debug.updateComponent',
						payload : {
							entityId    : component.getEntity().getId(),
							componentId : component.get( 'templateId' ),
							config      : componentConfig
						}
					}
				)
			}
		}
	}
});
