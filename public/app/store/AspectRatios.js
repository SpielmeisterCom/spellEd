Ext.define('Spelled.store.AspectRatios', {
    extend: 'Ext.data.Store',

	fields: ['aspectRatio', 'name'],


	/**
	 * 320x480  2:3 Apple iPhone 3GS
	 * 640x940  2:3 Apple iPhone 4G
	 * 768x1024 4:3 Apple iPad 1, Apple iPad 2
	 * 480x800  3:5 HTC Desire, HTC Desire HD, HTC Desire Z, HTC Mozart, Samsung Wave II S8530, Samsung Wave S8500
	 * 240x320  3:4
	 * 320x480  2:3
	 * 360x640  9:16
	 * 1024x600 128:75 Samsung Galaxy Tab
	 */
	data : [
		{
			"aspectRatio": 0,
			"name":"Fit to screen"
		},
		{
			"aspectRatio": 1.333333333333333,
			"name":"4:3 iPad1, iPad2, iPad3 [landscape]"
		},
		{
			"aspectRatio": 0.75,
			"name":"3:4 iPad1, iPad2, iPad3 [portrait]"
		},
		{
			"aspectRatio": 0.6666666666666667,
			"name":"2:3 iPhone3, iPhone4 [portrait]"
		},
		{
			"aspectRatio": 1.5,
			"name":"3:2 iPhone3, iPhone4 [landscape]"
		},
		{
			"aspectRatio": 0.6,
			"name":"3:5 Galaxy S, HTC Desire [portrait]"
		},
		{
			"aspectRatio": 1.666666667,
			"name":"5:3 Galaxy S, HTC Desire [landscape]"
		},
		{
			"aspectRatio": 1.777777777777778,
			"name":"16:9"
		},
		{
			"aspectRatio": 1.6,
			"name":"16:10"
		}
	]
});
