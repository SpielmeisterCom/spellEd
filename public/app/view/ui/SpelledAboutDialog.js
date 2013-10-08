Ext.define('Spelled.view.ui.SpelledAboutDialog' ,{
    extend: 'Ext.Window',
    title : 'About SpellEd',
    alias: 'widget.spelledabout',

    requires: [
        'widget.spelledabouttheproduct',
        'widget.spelledaboutconfiguration',
        'widget.spelledaboutmodules',
        'widget.spelledaboutlicense'
    ],

	width: 500,
	height: 400,

	autoShow: true,
    modal : true,
    closable: true,

	layout: 'fit',

	defaults: {
		padding: 5
	},

	initComponent: function() {

		var items = [
			{ xtype: 'spelledabouttheproduct' },
			{ xtype: 'spelledaboutconfiguration' }
		]

		if( Spelled.platform.Adapter.isNodeWebKit() ) {
			Ext.Array.push(
				items,
				[
					{ xtype: 'spelledaboutlicense' },
					{ xtype: 'spelledaboutmodules' }
				]
			)
		}

		Ext.applyIf(
			this, {
                items: [{
					xtype: 'tabpanel',
					items: items
				}]
            }
		)

		this.callParent( arguments )
	}
});