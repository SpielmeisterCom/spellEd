Ext.define(
	'Spelled.store.project.Plugins',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'pluginId', 'fields', 'getValues', 'setValues' ],

		data : [
			{
				pluginId: 'admob',
				name: 'AdMob',
				getValues: function() {
					var values = {}
					values.active = this.down( 'checkbox[name="active"]' ).getValue()

					this.down( 'tabpanel' ).items.each(
						function( panel ) {
							panel.items.each(
								function( field ) {
									if( !Ext.isObject( values[ field.name ] ) ) {
										values[ field.name ] = {}
									}

									values[ field.name ][ panel.configId ] = field.getValue()
								}
							)
						}
					)

					return values
				},
				setValues: function( values ) {
					this.down( 'checkbox[name="active"]' ).setValue( values.active )

					if( !Ext.isObject( values ) ) return

					this.down( 'tabpanel' ).items.each(
						function( panel ) {
							panel.items.each(
								function( field ) {
									var tmp = values[ field.name ]

									if( Ext.isObject( tmp ) ) field.setValue( tmp[ panel.configId ] )
								}
							)
						}
					)
				},
				fields: [
					{
						xtype: 'tabpanel',
						items: [
							{
								title: 'Debug',
								configId: 'debug',
								items: [
									{
										xtype: 'textfield',
										fieldLabel: 'Android AdMob Publisher Id',
										name: 'androidAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPad AdMob Publisher Id',
										name: 'iPadAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPhone AdMob Publisher Id',
										name: 'iPhoneAdMobPublisherId',
										value: ''
									}
								]
							},
							{
								title: 'Release',
								configId: 'release',
								items: [
									{
										xtype: 'textfield',
										fieldLabel: 'Android AdMob Publisher Id',
										name: 'androidAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPad AdMob Publisher Id',
										name: 'iPadAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPhone AdMob Publisher Id',
										name: 'iPhoneAdMobPublisherId',
										value: ''
									}
								]
							}
						]
					}

				]
			},
			{
				pluginId: 'admobWithChartboost',
				name: 'AdMob (with Chartboost)',
				getValues: function() {
					var values = {}
					values.active = this.down( 'checkbox[name="active"]' ).getValue()

					this.down( 'tabpanel' ).items.each(
						function( panel ) {
							panel.items.each(
								function( field ) {
									if( !Ext.isObject( values[ field.name ] ) ) {
										values[ field.name ] = {}
									}

									values[ field.name ][ panel.configId ] = field.getValue()
								}
							)
						}
					)

					return values
				},
				setValues: function( values ) {
					this.down( 'checkbox[name="active"]' ).setValue( values.active )

					if( !Ext.isObject( values ) ) return

					this.down( 'tabpanel' ).items.each(
						function( panel ) {
							panel.items.each(
								function( field ) {
									var tmp = values[ field.name ]

									if( Ext.isObject( tmp ) ) field.setValue( tmp[ panel.configId ] )
								}
							)
						}
					)
				},
				fields: [
					{
						xtype: 'tabpanel',
						items: [
							{
								title: 'Debug',
								configId: 'debug',
								items: [
									{
										xtype: 'textfield',
										fieldLabel: 'Android AdMob Publisher Id',
										name: 'androidAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPad AdMob Publisher Id',
										name: 'iPadAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPhone AdMob Publisher Id',
										name: 'iPhoneAdMobPublisherIdDebug',
										value: ''
									}
								]
							},
							{
								title: 'Release',
								configId: 'release',
								items: [
									{
										xtype: 'textfield',
										fieldLabel: 'Android AdMob Publisher Id',
										name: 'androidAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPad AdMob Publisher Id',
										name: 'iPadAdMobPublisherId',
										value: ''
									},
									{
										xtype: 'textfield',
										fieldLabel: 'iPhone AdMob Publisher Id',
										name: 'iPhoneAdMobPublisherIdDebug',
										value: ''
									}
								]
							}
						]
					}
				]
			}
		]
	}
);
