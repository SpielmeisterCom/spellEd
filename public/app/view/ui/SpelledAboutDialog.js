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

	autoShow: true,
    modal : true,
    closable: true,

	initComponent: function() {

		Ext.applyIf(
			this, {
                width: 500,
                height: 300,
                defaults: {
                    padding:5
                },
                items: [{
                        xtype: 'tabpanel',
                        items: [

                            {
                                xtype: 'spelledabouttheproduct'
                            },
                            {
                                xtype: 'spelledaboutlicense'
                            },
                            {
                                xtype: 'spelledaboutconfiguration'
                            },
                            {
                                xtype: 'spelledaboutmodules'
                            }
                        ]
                    }]
            }
		)

		this.callParent( arguments )
	}
});