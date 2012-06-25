Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'templateId',
        'name'
    ],

    idgen: 'uuid',

	associations: [{
		model:"Spelled.model.config.Scene",
		type:"belongsTo",
		getterName: 'getScene'
	}],

	setScene: function( scene ) {
		this[ 'Spelled.model.config.SceneBelongsToInstance' ] = scene
	},

    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    getComponentByTemplateId: function( templateId ) {
        var result = undefined
        this.getComponents().each(
            function( component ) {
                if( component.get('templateId') === templateId ) {
                    result = component
                    return false
                }
            }
        )

        return result
    },

    mergeWithTemplateConfig: function() {
        var entityTemplate     = Ext.getStore( 'template.Entities' ).getByTemplateId( this.get('templateId')),
            templateComponents = entityTemplate.getComponents(),
            components          = this.getComponents()

        templateComponents.each(
            function( templateComponent ) {
                var component = this.getComponentByTemplateId( templateComponent.get('templateId') )

                if( !component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        templateId: templateComponent.get('templateId'),
                        config: templateComponent.get('config')
                    })
					newComponent.setEntity( this )

                    components.add( newComponent )
                }
            },
            this
        )
    },

    constructor: function() {
        this.callParent(arguments)

		if( !!this.raw )
        	Ext.getStore( 'config.Entities' ).add( this )
    },

    getJSONConfig: function() {

        var result = this.data
        var components = this.getComponents()

        result.components = []
        components.each( function( component ){
            result.components.push( component.getJSONConfig() )
        })

        return result
    }
});
