Ext.define('Spelled.view.ui.about.Modules' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.spelledaboutmodules',

    title : 'Modules',

	createModuleInfo: function( name, version, date ) {
		return {
			xtype: 'fieldcontainer',
			labelWidth: 150,
			fieldLabel: name,
			items: [
				{
					xtype: 'displayfield',
					fieldLabel: 'Version',
					value: version
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Buildtime',
					value: Ext.Date.format( new Date( date ), 'Y-m-d H:i:s' )
				}
			]
		}
	},

    initComponent: function() {
		var me          = this,
			configItems = [],
			fs          = require( 'fs'),
			filePath    = Spelled.app.platform.getFilePath( 'moduleBuilds.json' )

		var modules = fs.existsSync( filePath ) ? Ext.decode( fs.readFileSync( filePath, 'utf8' ) ) : false

		if( modules ) {
			Ext.Object.each(
				modules,
				function( key, value ) {
					configItems.push( me.createModuleInfo( key, value.buildNumber, value.buildTimeStamp ) )
				}
			)
		}

        Ext.applyIf( me, {
            items: configItems
        })

        this.callParent( arguments )
    }
})