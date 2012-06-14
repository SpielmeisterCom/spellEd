Ext.define('Spelled.controller.Components', {
    extend: 'Ext.app.Controller',

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
			defaultConfig = component.getConfigMergedWithBlueprintConfig()

		if( defaultConfig[ record.name ] != record.value ) {
			var config = component.get( 'config' )

			try {
				config[ record.name ] = eval( record.value )
			} catch( e ) {
				config[ record.name ] = record.value
			}
			component.set( 'config', config)

			component.setChanged()
		}
	},

    convertValueForGrid: function( value ) {
        if( Ext.isArray( value ) === true ) {
            return "[" + value.toString() + "]"
        } else {
            try{
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