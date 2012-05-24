Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

    customEditors: {
        //TODO: when a assigned asset gets removed, the field will disappear
        textureId: Ext.create(
            'Ext.form.ComboBox', {
                forceSelection : true,
                displayField   : 'name',
                emptyText      :'-- Select a texture --',
                valueField     : 'assetId'
            }
        )
    },

    source: {

    },

    constructor: function() {
        this.callParent(arguments)

        //TODO: find a way to set this directly in the custumEditors...
        this.customEditors.textureId.store = Ext.getStore( "asset.Textures" )

        this.on('edit', function( editor, e ) {
            var componentConfigId = e.grid.componentConfigId

            var component = Ext.getStore('config.Components').getById( componentConfigId )

            var record = e.record.data

            var config = component.get( 'config' )

            if( config[ record.name ] != record.value ) {
                try {
                    config[ record.name ] = eval( record.value )
                } catch( e ) {
                    config[ record.name ] = record.value
                }
                component.set( 'config', config)

                component.setChanged()
            }
        })
    }
});