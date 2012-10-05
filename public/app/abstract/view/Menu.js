Ext.define('Spelled.abstract.view.Menu' ,{
	extend: 'Ext.menu.Menu',

	ownerView: undefined,

	getOwnerView: function() {
		return this.ownerView
	},

	setOwnerView: function( view ) {
		this.ownerView = view
	},

	getTabPanel: function() {
		return this.getOwnerView().up( 'tabpanel' )
	},

	initComponent: function() {
		this.callParent()
	}
});
