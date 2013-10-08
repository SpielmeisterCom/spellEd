Ext.define('Spelled.view.ui.about.License' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.spelledaboutlicense',

    title : 'Your License',

    listeners: {
        'beforeedit': {
            fn: function(){
                return false;
            }
        }
    },

    initComponent: function() {
		var stateProvider = Spelled.Configuration.getStateProvider(),
			license       = stateProvider.get( 'license' ),
			payload       = license.payload,
			features      = payload.pfs

		var expireDate = Spelled.Converter.getLicenseExpireDate( payload.isd, payload.days )

		var featuresSource = {}

		Ext.Array.each(
			features,
			function( item ) {
				featuresSource[ item.name ] = item.included
			}
		)

		Ext.applyIf( this, {
			items:[
				{
					xtype: 'propertygrid',
					title: 'General information',
					border: false,
					source: {
						"User": payload.uid,
						"Type": payload.pid,
						"Ordered": Ext.Date.format( new Date( payload.isd ), 'F j, Y' ),
						"Expires": Ext.Date.format( expireDate, 'F j, Y' )
					}
				},
				{
					xtype: 'propertygrid',
					title: 'Features',
					border: false,
					source: featuresSource
				}
			]
		})

        this.callParent( arguments )
    }
})