Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',

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
		}
	],

	init: function() {
		this.control({
			'componentproperties': {
				edit: this.editProperty,
				showDocumentation: this.showDocumentation,
				beforeclose: this.confirmDelete
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

	showDocumentation: function( event, toolEl, panel ) {
		var componentGrid = panel.up( 'componentproperties' )

		if( !!componentGrid.componentConfigId ) {
			var component = Ext.getStore( 'config.Components' ).getById( componentGrid.componentConfigId ),
				template  = component.getTemplate()

			if( template && Ext.isObject( this.application.configuration ) ) {
				var docPath = this.application.configuration.documentationServerURL + "#!/guide/" + template.getDocumentationName()
				window.open( docPath, '_blank')
			}
		}
	},

	showAddComponentButton: function( panel ) {
		if( !this.addingButton ) {
			this.addingButton = true

			var cmp = panel.down( 'addcomponentbutton' )
			if( !!cmp ) panel.remove( cmp )

			panel.add( Ext.createWidget( 'addcomponentbutton' ) )

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
		store.remove( component )
	},

	showAddComponent: function( button ) {
		var view   = Ext.createWidget( 'addcomponent' ),
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
					var newNode = node.createNode ( {
						text      : componentTemplate.getFullName(),
						id        : component.getId(),
						expanded  : true,
						leaf      : false
					} )

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
			record            = e.record.data,
			component         = this.getConfigComponentsStore().getById( componentConfigId ),
			config            = Ext.Object.merge( {}, component.get('config') ),
			defaultConfig     = component.getConfigMergedWithTemplateConfig(),
			value             = record.value

		try {
			value = JSON.parse( value )
		} catch ( e ) {}

		if( config[ record.name ] != value ) {
			try {
				config[ record.name ] = eval( value )
			} catch( e ) {
				config[ record.name ] = value
			}

			if( config[ record.name ] == defaultConfig[ record.name ] ) {
				delete config[ record.name ]
			}

			component.set( 'config', config)

			component.setChanged()
		}
	},

	convertValueForGrid: function( value ) {
		if( Ext.isArray( value ) === true ) {
			return "[" + value.toString() + "]"
		} else if( Ext.isObject( value ) ) {
			return Ext.encode( value )
		} else {
			try{
				if( !eval(value) )
					return value
				else
					return eval(value)
			} catch( e ) {
				return value
			}
		}
	},

	createConfigGridView: function( component ) {
        var config   = {},
			template = component.getTemplate(),
			title    = ( Ext.isEmpty( template.get('title') ) ) ? component.get('templateId') : template.get('title')

        Ext.iterate(
            component.getConfigMergedWithTemplateConfig(),
            function( key, value ) {
				config[ key ] = this.convertValueForGrid( value )
            },
            this
        )

		var configGrid = Ext.createWidget(
			'componentproperties',
			{
				title: (  ( component.get('additional') ) ? "<span class='component-icon'/> " : "<span class='linked-component-icon'/> " ) + "<span>" + title +"</span>" ,
				isAdditional: component.get('additional'),
				source: config,
				componentConfigId: component.getId()
			}
		)

		return configGrid
    }
});
