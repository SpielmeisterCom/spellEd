Ext.define('Spelled.view.project.settings.Tizen' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projecttizensettings',

    title : 'Tizen',

	getImagePathForImage: function( image ) {
		var projectName = Spelled.Configuration.getStateProvider().get( 'projectName' ),
			path        = '/' + projectName + '/resources/tizen/' + image

		return path
	},

	initComponent: function() {

		Ext.applyIf( this, {
				items: [
                    {
                        xtype:'fieldset',
                        title: 'App Icon',
                        items: [
                            {
                                xtype: 'image',
                                src: this.getImagePathForImage( 'icon.png' ),
                                width: 117,
                                height: 117,
                                style: 'cursor:pointer',
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function(){
                                            window.alert('exchange icon');
                                        }
                                    }
                                }
                            }
                        ]
                    },
					{
						xtype:'fieldset',
						title: 'General',
						defaults: {
							labelWidth: 130
						},
						items: [
							{
								xtype: 'textfield',
								name: 'identifier',
								fieldLabel: 'Identifier',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'version',
								fieldLabel: 'App version',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'name',
								fieldLabel: 'App Name',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'appId',
								fieldLabel: 'App ID',
								anchor: '100%'
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
                                xtype: 'textfield',
                                name: 'signingKeyStore',
                                fieldLabel: 'Keystore',
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                name: 'signingKeyStorePass',
                                fieldLabel: 'Keystore Password',
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                name: 'signingKeyAlias',
                                fieldLabel: 'Key Alias',
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                name: 'signingKeyPass',
                                fieldLabel: 'Key Password',
                                anchor: '100%'
                            }
                        ]
                    }
                ]
			}
		)

		this.callParent( arguments )
	}
})