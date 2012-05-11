Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

    source: {

    },

    constructor: function() {
        this.callParent(arguments)

        this.on('edit', function(editor, e) {
            var componentConfigId = e.grid.componentConfigId

            var component = Ext.getStore('config.Components').getById( componentConfigId )

            var record = e.record.data

            var config = component.get( 'config' )

            //TODO: EVAL IS EVIL
            if( record.value.match( /\[.*\]/ ) ) {
                config[ record.name ] = eval( record.value )
            } else {
                config[ record.name ] = record.value
            }

            component.set( 'config', config)
        })
    }
});