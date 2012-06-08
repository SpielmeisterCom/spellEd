Ext.define('Spelled.view.component.Properties', {
    extend: 'Ext.grid.property.Grid',

    alias : 'widget.componentproperties',

    title: 'Component Configuration',

    customEditors: {
        //TODO: when a assigned asset gets removed, the field will disappear
        textureId: Ext.create(
            'Ext.form.ComboBox', {
                editable: false,
                displayField   : 'name',
                emptyText      :'-- Select a texture --',
				store          : 'asset.Textures',
                valueField     : 'assetId'
            }
        )
    },

    source: {}
});