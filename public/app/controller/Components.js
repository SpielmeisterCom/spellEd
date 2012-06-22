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
				edit: this.editProperty
			},
			'entitycomponentslist button[action="showAddComponent"]': {
				click: this.showAddComponent
			},
			'addcomponent button[action="addComponent"]': {
				click : this.addComponent
			}

		})
	},

	showAddComponent: function( button ) {
		var view = Ext.createWidget( 'addcomponent' )

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
		entity.getComponents().add( record )
		record.setEntity( entity )

		store.add( record )
		this.application.getController('Entities').showComponentsList( entity )

		window.close()
	},

    formatConfiguration: function( component ) {

    },

	editProperty: function( editor, e ) {
		var componentConfigId = e.grid.componentConfigId,
			record = e.record.data,
			component = this.getConfigComponentsStore().getById( componentConfigId ),
			defaultConfig = component.getConfigMergedWithTemplateConfig(),
			value = record.value

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
        var config = {}
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
				title: component.get('templateId'),
				source: config,
				componentConfigId: component.getId()
			}
		)

		return configGrid
    }
});
