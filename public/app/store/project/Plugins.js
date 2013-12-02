Ext.define(
	'Spelled.store.project.Plugins',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'fields' ],

		data : [
			{
				name: 'AdMob',
				fields: [
					{
						xtype: 'hiddenfield',
						name: 'id',
						value: 'admob'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android AdMob Publisher Id (Debug)',
						name: 'androidAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android AdMob Publisher Id (Release)',
						name: 'androidAdMobPublisherIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPad AdMob Publisher Id (Debug)',
						name: 'iPadAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPad AdMob Publisher Id (Release)',
						name: 'iPadAdMobPublisherIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPhone AdMob Publisher Id (Debug)',
						name: 'iPhoneAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPhone AdMob Publisher Id (Release)',
						name: 'iPhoneAdMobPublisherIdRelease',
						value: ''
					}
				]
			},
			{
				name: 'AdMob (with Chartboost)',
				fields: [
					{
						xtype: 'hiddenfield',
						name: 'id',
						value: 'admobWithChartboost'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android AdMob Publisher Id (Debug)',
						name: 'androidAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android AdMob Publisher Id (Release)',
						name: 'androidAdMobPublisherIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPad AdMob Publisher Id (Debug)',
						name: 'iPadAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPad AdMob Publisher Id (Release)',
						name: 'iPadAdMobPublisherIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPhone AdMob Publisher Id (Debug)',
						name: 'iPhoneAdMobPublisherIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iPhone AdMob Publisher Id (Release)',
						name: 'iPhoneAdMobPublisherIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android Chartboost App Id (Debug)',
						name: 'androidChartboostAppIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android Chartboost App Id (Release)',
						name: 'androidChartboostAppIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android Chartboost App Signature (Debug)',
						name: 'androidChartboostAppSignatureDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Android Chartboost App Signature (Release)',
						name: 'androidChartboostAppSignatureRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iOS Chartboost App Id (Debug)',
						name: 'iOSChartboostAppIdDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iOS Chartboost App Id (Release)',
						name: 'iOSChartboostAppIdRelease',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iOS Chartboost App Signature (Debug)',
						name: 'iOSChartboostAppSignatureDebug',
						value: ''
					},
					{
						xtype: 'textfield',
						fieldLabel: 'iOS Chartboost App Signature (Release)',
						name: 'iOSChartboostAppSignatureRelease',
						value: ''
					}
				]
			}
		]
	}
);
