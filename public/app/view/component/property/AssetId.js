Ext.define('Spelled.view.component.property.AssetId', {
    extend: 'Ext.form.ComboBox',

	alias : 'widget.assetidproperty',

	listeners: {
		focus: function() {
            if( !this.getStore() ) return

			var store   = this.getStore(),
				filters = store.filters.items

			if( filters.length > 0 ) store.filter( filters )
		},
		added: function() {
			this.getStore().load()
		},
		beforequery: function(qe){
			qe.query = new RegExp(qe.query, 'i')
			qe.forceAll = true
		}
	},

	validator: function( value ) {
        if( !this.getStore() ) return false

		var record = this.getStore().findRecord( 'myAssetId', value, 0, false, false, true )
		if( record ) return true
		else return "No such asset"
	},

	matchFieldWidth : false,
	forceSelection  : true,
	queryMode       : 'local',
	editable        : true,
	emptyText       : '-- Select a existing Asset --',
	name            : 'assetId',
	displayField    : 'myAssetId',
	valueField      : 'internalAssetId',

	mixins: [ 'Spelled.abstract.grid.Property' ],

	initComponent: function() {
		this.addEditPropertyEvent()
		this.callParent()
	}
});