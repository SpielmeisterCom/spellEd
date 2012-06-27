Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',

    views: [
        'component.Properties',
		'component.property.AssetId',
		'component.Add'
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
				beforeclose: this.confirmDelete
			},
			'entitycomponentslist button[action="showAddComponent"]': {
				click: this.showAddComponent
			},
			'addcomponent button[action="addComponent"]': {
				click : this.addComponent
			}

		})
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
			entity = this.application.getController('Entities').getActiveEntity(),
			assignedComponent = entity.getComponents()

		var store = Ext.create( 'Ext.data.Store',
			{
				model: 'Spelled.model.template.Component'
			}
		)

		Ext.getStore('template.Components').each(
			function( record ){
				if( assignedComponent.find( 'templateId', record.get('templateId') ) === -1 ) {
					store.add( record )
				}
			}
		)

		view.down('combobox[name="templateId"]').bindStore( store )

		view.show()
	},

	addComponent: function( button ) {
		var window = button.up('window'),
			form   = window.down('form'),
			values = form.getValues(),
			store  = this.getConfigComponentsStore(),
			Model  = this.getConfigComponentModel(),
			entity = this.application.getController('Entities').getActiveEntity()

		this.getRightPanel().removeAll()

		var record = new Model( values )
		record.set('additional', true)
		record.setEntity( entity )

		entity.getComponents().add( record )
		store.add( record )

		this.application.getController('Entities').showComponentsList( entity )

		window.close()
	},

    formatConfiguration: function( component ) {

    },

	editProperty: function( editor, e ) {
		var componentConfigId = e.grid.componentConfigId,
			record            = e.record.data,
			component         = this.getConfigComponentsStore().getById( componentConfigId ),
			defaultConfig     = component.getConfigMergedWithTemplateConfig(),
			value             = record.value

		try {
			value = JSON.parse( value )
		} catch ( e ) {}

		if( defaultConfig[ record.name ] != value ) {
			var config = component.get( 'config' )
			try {
				config[ record.name ] = eval( value )
			} catch( e ) {
				config[ record.name ] = value
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
                if( Ext.isObject( value ) && !!value.isModel ) {
                    config[ key ] = this.convertValueForGrid( value.get('default') )
                } else {
                    config[ key ] = this.convertValueForGrid( value )
                }
            },
            this
        )

		var configGrid = Ext.createWidget(
			'componentproperties',
			{
				title: title,
				isAdditional: component.get('additional'),
				source: config,
				componentConfigId: component.getId()
			}
		)

		return configGrid
    }
});
