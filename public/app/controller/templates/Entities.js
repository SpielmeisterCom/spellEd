Ext.define('Spelled.controller.templates.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'template.Entity',
		'config.Entity'
    ],

    stores: [
        'template.Entities'
    ],

	views: [
		'template.entity.Add',
		'template.entity.Edit'
	],

	refs: [
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref: 'TemplatesTree',
			selector: '#TemplatesTree'
		},
		{
			ref : 'TemplateEditor',
			selector: '#TemplateEditor'
		}
	],

    init: function() {
        this.control({
            'entitycomponentslist button[action="saveTemplateEntity"]' : {
                click: this.saveEntityTemplate
			},
			'addentitytotemplate button[action="addEntityToTemplate"]' : {
				click: this.addEntityToTemplate
			}
        })
    },

	openTemplate: function( entityTemplate ) {
		var templateEditor = this.getTemplateEditor()

		var editView = Ext.widget( 'entitytemplateedit',  {
				title    : entityTemplate.getFullName(),
				template : entityTemplate
			}
		)

		this.application.createTab( templateEditor, editView )
	},

	getOwnerNode: function( node ) {
		return ( node.get('cls') === this.application.getController( 'Templates' ).TEMPLATE_TYPE_ENTITY ) ? node : this.getOwnerNode( node.parentNode )
	},

	showAddEntity: function( owner ) {
		var createView  = Ext.widget( 'addentitytotemplate' ),
			EntityModel = this.getConfigEntityModel(),
			newEntity   = new EntityModel()

		createView.down('form').loadRecord( newEntity )
		newEntity.set( 'isTemplateComposite', true )
		newEntity.setEntity( owner )

		createView.show()
	},

	addEntityToTemplate: function( button ) {
		var window = button.up('addentitytotemplate'),
			form   = window.down('form'),
			record = form.getRecord(),
			values = form.getValues(),
			me     = this,
			node   = me.application.getLastSelectedNode( me.getTemplatesTree() )

		record = this.application.getController( 'Entities' ).createEntityHelper( record, values )
		Ext.getStore( 'config.Entities' ).add( record )

		record.getOwner().save( {
			callback: function() {
				node.set( 'leaf', false )
				var entityNode = record.createTreeNode( node )
				entityNode.set( 'cls', me.application.getController('Templates').TYPE_ENTITY_COMPOSITE )

				me.getTemplatesTree().selectPath( node.appendChild( entityNode ).getPath() )

				window.close()
			}
		})

	},

	showEntityTemplateComponentsListHelper: function( id ) {
		var entity = this.getTemplateEntitiesStore().getById( id )

		if( !entity ) {
			var EntityTemplate = this.getTemplateEntityModel()

			EntityTemplate.load( id, {
				scope: this,
				success: this.showEntityTemplateComponentsList
			})
		} else {
			this.showEntityTemplateComponentsList( entity )
		}
	},

	showEntityCompositeComponentsListHelper: function( node ) {
		var templateEntity = this.getTemplateEntitiesStore().getById( this.getOwnerNode( node ).getId()  )

		var entity = templateEntity.getChild( node.get('text') )
		node.set('id', entity.getId())

		entity.set( 'isTemplateComposite' , true )
		entity.setOwnerEntity( templateEntity )

		if( entity ) {
			if( !entity.isAnonymous() ) entity.mergeWithTemplateConfig()

			this.showEntityTemplateComponentsList( entity )
		}
	},

	showEntityTemplateComponentsList: function( entity ) {
		var view = this.application.getController('Entities').createComponentsListView( entity )

		if( !!entity.isReadonly && entity.isReadonly() ) {
			view.disable()
			this.application.getController( 'Templates' ).addDisabledTemplateHeader( view )
		} else {

			view.addDocked(
				{
					xtype: 'toolbar',
					dock: 'bottom',
					ui: 'footer',
					items: [{
						xtype: 'button',
						icon: 'images/icons/table_refresh.png',
						text: 'Save',
						action: 'saveTemplateEntity',
						dock: 'bottom'
					}]
				}
			)
		}

	},

	removeEntityCompositeNode: function( node ) {
        var entity    = Ext.getStore( 'config.Entities' ).getById( node.getId() ),
			template  = entity.getOwner(),
			owner     = ( entity.hasEntity() ) ? entity.getEntity() : template,
			ownerNode = node.parentNode

		owner.getChildren().remove( entity )
		Ext.getStore( 'config.Entities' ).remove( entity )
		template.save()
		node.remove()

		if( !ownerNode.hasChildNodes() ) {
			ownerNode.set( 'cls', this.application.getController('Templates').TEMPLATE_TYPE_ENTITY )
			this.getTemplatesTree().selectPath( ownerNode.getPath() )
		}
	},

    removeEntityTemplate: function( id ) {
        var EntityTemplate = this.getTemplateEntityModel()

        EntityTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

    saveEntityTemplate: function( button ) {
        var panel      = button.up('entitycomponentslist'),
            ownerModel = panel.entity

        if( !!ownerModel ) {
			if( !!ownerModel.isTemplateComposite && ownerModel.isTemplateComposite() ) {
				ownerModel = ownerModel.getOwner()
			}

			ownerModel.save( )
        }

    }
});
