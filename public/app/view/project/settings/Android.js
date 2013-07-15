Ext.define('Spelled.view.project.settings.Android' ,{
    extend: 'Ext.form.Panel',
    alias: 'widget.projectandroidsettings',

    title : 'Android',

	initComponent: function() {

		Ext.applyIf( this, {
				items: [
                    {
                        xtype:'fieldset',
                        title: 'App Icons',
                        items: [
                            {
                                xtype: 'image',
                                src: '/superkumba/resources/android/drawable-ldpi/icon.png',
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
                                src: '/superkumba/resources/android/drawable-mdpi/icon.png',
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
                                src: '/superkumba/resources/android/drawable-hdpi/icon.png',
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
                                src: '/superkumba/resources/android/drawable-xhdpi/icon.png',
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
                        title: 'Signing options',
                        defaults: {
                            labelWidth: 130
                        },
                        items: [
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
                            },
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
                            }
                        ]
                    }
                ]
			}
		)

		this.callParent( arguments )
	}
})