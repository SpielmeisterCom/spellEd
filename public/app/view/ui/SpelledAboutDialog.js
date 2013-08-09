Ext.define('Spelled.view.ui.SpelledAboutDialog' ,{
    extend: 'Ext.Window',
    title : 'About SpellEd',

    alias: 'widget.spelledabout',

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
                                xtype: 'spelledaboutmodules'
                            },
                            {
                                xtype: 'spelledaboutconfiguration'
                            }
                        ]
                    }]
            }
		)

		this.callParent( arguments )
	}
});