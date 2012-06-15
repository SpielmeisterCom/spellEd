Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',

	//Needed for Combobox creation in the Property view
	requires: [ 'Ext.form.ComboBox' ],

    views: [
        'component.Properties'
    ],

    models: [
        'config.Component'
    ],

    stores: [
       'config.Components'
    ],

	init: function() {
		this.control({
			'componentproperties': {
				edit: this.editProperty
			}
		})
	},

    formatConfiguration: function( component ) {

    },

	editProperty: function( editor, e ) {
		var componentConfigId = e.grid.componentConfigId,
			record = e.record.data,
			component = this.getConfigComponentsStore().getById( componentConfigId ),
			defaultConfig = component.getConfigMergedWithBlueprintConfig(),
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

	showConfig: function( component ) {
        var config = {}
        Ext.iterate(
            component.getConfigMergedWithBlueprintConfig(),
            function( key, value ) {
                if( Ext.isObject( value ) && !!value.isModel ) {
                    config[ key ] = this.convertValueForGrid( value.get('default') )
                } else {
                    config[ key ] = this.convertValueForGrid( value )
                }
            },
            this
        )

        var propertyGrid = Ext.getCmp('ComponentProperty')

        propertyGrid.setSource( config )
        propertyGrid.componentConfigId = component.getId()
    }
});