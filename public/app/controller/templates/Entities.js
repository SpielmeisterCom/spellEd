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
		'template.entity.Add'
	],

	refs: [
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref: 'TemplatesTree',
			selector: '#TemplatesTree'
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

	showAddEntity: function( owner ) {
		var createView  = Ext.createWidget( 'addentitytotemplate' ),
			EntityModel = this.getConfigEntityModel(),
			newEntity   = new EntityModel()

		createView.down('form').loadRecord( newEntity )
		newEntity.setEntity( owner )

		createView.show()
	},

	addEntityToTemplate: function( button ) {
		var window = button.up('addentitytotemplate'),
			form   = window.down('form'),
			record = form.getRecord(),
			values = form.getValues(),
			me     = this

		record = this.application.getController( 'Entities' ).createEntityHelper( record, values )

		record.getEntity().save( {
			callback: function() {
				var node = me.application.getLastSelectedNode( me.getTemplatesTree() )
				node.set( 'leaf', false )
				me.getTemplatesTree().selectPath( node.appendChild( record.createTreeNode( node )).getPath() )

				window.close()
			}
		})

	},

	showEntityTemplateComponentsListHelper: function( id ) {
		var EntityTemplate = this.getTemplateEntityModel()

		EntityTemplate.load( id, {
			scope: this,
			success: this.showEntityTemplateComponentsList
		})
	},

	showEntityTemplateComponentsList: function( entityTemplate ) {

		var view = this.application.getController('Entities').createComponentsListView( entityTemplate )

		view.addDocked(
			{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				items: [{
					xtype: 'button',
					icon: 'images/icons/table_refresh.png',
					text: 'Save Entity Template to Disk',
					action: 'saveTemplateEntity',
					dock: 'bottom'
				}]
			}
		)

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
            ownerModel.save( )
            this.application.getController('Templates').refreshTemplateStores()
        }

    }
});
