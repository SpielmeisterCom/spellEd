Ext.define('Spelled.view.template.component.attribute.Script', {
//    extend: 'Spelled.view.component.property.AssetId',
//    alias : 'widget.spelledscript',
//
//	store: 'script.Scripts',
//
//    validator: function( value ) {
//        if( !this.getStore() ) return false
//        var record = this.getStore().findRecord( 'scriptId', value, 0, false, false, true )
//        if( record ) return true
//        else return "No such script"
//    },
//
//    emptyText       : 'none',
//    displayField    : 'scriptId'



    extend: 'Ext.form.ComboBox',
    alias : 'widget.spelledscript',
    store: 'script.Scripts',

    listeners: {
        focus: function() {
            if( !this.getStore() ) return

            var store   = this.getStore(),
                filters = store.filters.items

            if( filters.length > 0 ) store.filter( filters )
        },
        beforequery: function(qe){
            qe.query = new RegExp(qe.query, 'i')
            qe.forceAll = true
        }
    },

    validator: function( value ) {
        if( !this.getStore() ) return false
        var record = this.getStore().findRecord( 'scriptId', value, 0, false, false, true )
        if( record ) return true
        else return "No such asset"
    },

    matchFieldWidth : false,
    forceSelection  : true,
    queryMode       : 'local',
    editable        : true,
    emptyText       : 'none',
    name            : 'assetId',
    displayField    : 'scriptId',
    valueField      : 'internalAssetId',

    mixins: [ 'Spelled.base.grid.Property' ],

    initComponent: function() {
        this.addEditPropertyEvent()
        this.callParent()
    }
})
