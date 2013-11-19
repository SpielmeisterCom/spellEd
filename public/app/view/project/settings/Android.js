Ext.define('Spelled.view.project.settings.Android' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectandroidsettings',

    title : 'Android',

	getImagePrefix: function( postfix ) {
		var projectName = Spelled.Configuration.getStateProvider().get( 'projectName' ),
			path        = '/' + projectName + '/resources/android/drawable-' + postfix

		return path
	},

	initComponent: function() {

		Ext.applyIf( this, {
				items: [
                    {
                        xtype:'fieldset',
                        title: 'App Icons',
                        items: [
                            {
                                xtype: 'image',
                                src: this.getImagePrefix( 'ldpi/icon.png' ),
                                width: 36,
                                height: 36,
                                style: 'cursor:pointer',
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function(){
                                            window.alert('exchange ldpi icon');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                src: this.getImagePrefix( 'mdpi/icon.png' ),
                                width: 48,
                                height: 48,
                                style: 'cursor:pointer',
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function(){
                                            window.alert('exchange mdpi icon');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                src: this.getImagePrefix( 'hdpi/icon.png' ),
                                width: 72,
                                height: 72,
                                style: 'cursor:pointer',
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function(){
                                            window.alert('exchange hdpi icon');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'image',
                                src: this.getImagePrefix( 'xhdpi/icon.png' ),
                                width: 96,
                                height: 96,
                                style: 'cursor:pointer',
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function(){
                                            window.alert('exchange xhdpi icon');
                                        }
                                    }
                                }
                            }
                        ]
                    },
					{
						xtype:'fieldset',
						title: 'Package settings',
						defaults: {
							labelWidth: 130
						},
						items: [
							{
								xtype: 'textfield',
								name: 'package',
								fieldLabel: 'Package identifier',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'title',
								fieldLabel: 'App Title',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'version',
								fieldLabel: 'App version',
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