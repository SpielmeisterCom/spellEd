Ext.define(
	'Spelled.store.project.IOSResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'config' ],

		data : [{
			name: 'app-icon-57',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS6 iPhone App Icon',
				description:		'',
				width:				57,
				height:				57,
				path:				'resources/ios/Icon.png'
			}
		}, {
			name: 'app-icon-60',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS7 iPhone App Icon',
				description:		'',
				width:				60,
				height:				60,
				path:				'resources/ios/Icon-60.png'
			}
		}, {
			name: 'app-icon-72',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS6 iPad App Icon',
				description:		'',
				width:				72,
				height:				72,
				path:				'resources/ios/Icon-72.png'
			}
		}, {
			name: 'app-icon-76',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS7 iPad App Icon',
				description:		'',
				width:				76,
				height:				76,
				path:				'resources/ios/Icon-76.png'
			}
		}, {
			name: 'app-icon-114',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS6 iPhone App Icon for retina display',
				description:		'',
				width:				114,
				height:				114,
				path:				'resources/ios/Icon@2x.png'
			}
		}, {
			name: 'app-icon-120',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS7 iPhone App Icon for retina display',
				description:		'',
				width:				120,
				height:				120,
				path:				'resources/ios/Icon-60@2x.png'
			}
		}, {
			name: 'app-icon-144',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS6 iPad App Icon for retina display',
				description:		'',
				width:				144,
				height:				144,
				path:				'resources/ios/Icon-72@2x.png'
			}
		}, {
			name: 'app-icon-120',
			xtype: 'projectresourceimage',
			config: {
				title:				'iOS7 iPad App Icon for retina display',
				description:		'',
				width:				152,
				height:				152,
				path:				'resources/ios/Icon-76@2x.png'
			}
		}, {
			name: 'launchimage',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPhone and iPod Touch launch image',
				description:		'',
				width:				320,
				height:				480,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default.png'
			}
		}, {
			name: 'launchimage-2x',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPhone and iPod Touch launch image for retina display',
				description:		'',
				width:				640,
				height:				960,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default@2x.png'
			}
		}, {
			name: 'launchimage-568h-2x',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPhone 5 and iPod Touch (5th generation) launch image',
				description:		'',
				width:				640,
				height:				1136,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default-568h@2x.png'
			}
		}, {
			name: 'launchimage-landscape-ipad',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPad landscape launch image',
				description:		'',
				width:				1024,
				height:				768,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default-Landscape~ipad.png'
			}
		}, {
			name: 'launchimage-landscape-ipad-2x',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPad landscape launch image for retina display',
				description:		'',
				width:				2048,
				height:				1536,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default-Landscape@2x~ipad.png'
			}
		}, {
			name: 'launchimage-potrait-ipad',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPad portrait launch image',
				description:		'',
				width:				768,
				height:				1024,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default-Portrait~ipad.png'
			}
		}, {
			name: 'launchimage-portrait-ipad-2x',
			xtype: 'projectresourceimage',
			config: {
				title:				'iPad portrait launch image for retina display',
				description:		'',
				width:				1536,
				height:				2048,
				path:				'resources/ios/Images.xcassets/LaunchImage.launchimage/Default-Portrait@2x~ipad.png'
			}
		}, {
			name: 'appstore-icon',
			xtype: 'projectresourceimage',
			config: {
				title:				'App icon for the App Store',
				description:		'',
				width:				512,
				height:				512,
				path:				'resources/ios/Images.xcassets/iTunesArtwork.png'
			}
		}, {
			name: 'appstore-icon-2x',
			xtype: 'projectresourceimage',
			config: {
				title:				'App icon for the App Store (high resolution)',
				description:		'',
				width:				1024,
				height:				1024,
				path:				'resources/ios/Images.xcassets/iTunesArtwork@2x.png'
			}
		}, {
			name: 'provisioningfile-adhoc',
			xtype: 'projectresourceprovisionfile',
			config: {
				title:          'AdHoc Provisioning Profile',
				description:    '',
				path:           'resources/ios/certificates/adhoc.mobileprovision'
			}
		}, {
			name: 'provisioningfile-appstore',
			xtype: 'projectresourceprovisionfile',
			config: {
				title:          'App Store Provisioning Profile',
				description:    '',
				path:           'resources/ios/certificates/store.mobileprovision'
			}
		}]
	}
);
