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
		                title: 'General Build Options',
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
	                {
		                xtype:'fieldset',
		                title: 'Signing options (for release build)',
		                defaults: {
			                labelWidth: 130
		                },
		                items: [
			                {
				                fieldLabel: 'Provisioning Profile',
				                xtype: 'textfield',
				                name: 'releaseProvisioningProfile',
				                anchor: '100%'
			                }
		                ]
	                },
	                {
		                xtype:'fieldset',
		                title: 'Signing options (for debug build)',
		                defaults: {
			                labelWidth: 130
		                },
		                items: [
			                {
				                fieldLabel: 'Provisioning Profile',
				                xtype: 'textfield',
				                name: 'debugProvisioningProfile',
				                anchor: '100%'
			                }
		                ]
	                },
                ]
            }
        )

        this.callParent( arguments )
    }
})