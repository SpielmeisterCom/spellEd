Ext.define('Spelled.view.project.settings.iOS' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectiossettings',

    title : 'iOS',

    initComponent: function() {

        Ext.applyIf( this, {
                items: [
	                {
		                xtype:'fieldset',
		                title: 'App settings',
		                defaults: {
			                labelWidth: 130
		                },
		                items: [
			                {
				                xtype: 'textfield',
				                name: 'bundleId',
				                fieldLabel: 'Bundle ID',
				                anchor: '100%'
			                },
			                {
				                // Apple ID (a number) for your app from iTunes Connect.
				                xtype: 'numberfield',
				                name: 'appleId',
				                fieldLabel: 'Apple ID',
				                anchor: '100%'
			                }
		                ]
	                },
	                {
		                xtype:'fieldset',
		                title: 'Build Options',
		                defaults: {
			                labelWidth: 130
		                },
		                items: [
			                {
				                boxLabel: 'Open Xcode project to manually debug/build the project',
				                xtype: 'checkbox',
				                inputValue: true,
				                name: 'openXcode'
			                }
		                ]
	                },
                ]
            }
        )

        this.callParent( arguments )
    }
})