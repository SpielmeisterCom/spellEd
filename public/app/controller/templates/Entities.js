Ext.define('Spelled.controller.templates.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'template.Entity'
    ],

    stores: [
        'template.Entities'
    ],

    init: function() {
        this.control({
            'entitycomponentslist button[action="saveTemplateEntity"]' : {
                click: this.saveEntityTemplate
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
