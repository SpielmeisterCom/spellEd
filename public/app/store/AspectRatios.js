Ext.define('Spelled.store.AspectRatios', {
    extend: 'Ext.data.Store',

	fields: ['aspectRatio', 'name'],


	/**
	 * 3:2 devices
	 * 480x320      iPhone 3GS and lower, Android Devices
	 * 960x640      iPhone4, iPhone4S
	 *
	 * 4:3 devices
	 * 320x240      Android Devices
	 * 1024x768     iPad1, iPad2
	 * 2048x1536    iPad3
	 *
	 * 5:3 devices
	 * 480x800      HTC Desire, HTC Desire HD, HTC Desire Z, HTC Mozart, Samsung Wave II S8530, Samsung Wave S8500
	 *
	 * 16:9 devices
	 * 640x360      Symbian3 devices like Nokia C7
	 * 854x480      Android devices, MeeGo N9
	 *
	 * 16:10 devices
	 * 800x480      Android devices, WindowsPhone7
	 * 1280x800     Android tablets like Motorola Xoom, Asus Eee Pad Transformer
	 *
	 * 17:10 devices
	 * 1024x600     Android tablets like Samsung Galaxy Tab 7
	 *
	 * 128:75 devices
	 * 1024x600     Samsung Galaxy Tab
	 */
	data : [
		{
			"aspectRatio": 0,
			"name":"Fit to screen"
		},
		{
			"aspectRatio": 0.6666666666666667,
			"name":"3:2 iPhone3, iPhone4 [portrait]"
		},
		{
			"aspectRatio": 1.5,
			"name":"3:2 iPhone3, iPhone4 [landscape]"
		},
		{
			"aspectRatio": 0.75,
			"name":"4:3 iPad1, iPad2, iPad3 [portrait]"
		},
		{
			"aspectRatio": 1.333333333333333,
			"name":"4:3 iPad1, iPad2, iPad3 [landscape]"
		},
		{
			"aspectRatio": 0.6,
			"name":"5:3 Galaxy S, HTC Desire [portrait]"
		},
		{
			"aspectRatio": 1.666666667,
			"name":"5:3 Galaxy S, HTC Desire [landscape]"
		},
		{
			"aspectRatio": 0.5625,
			"name":"16:9 Nokia C7, MeeGo N9 [portrait]"
		},
		{
			"aspectRatio": 1.777777777777778,
			"name":"16:9 Nokia C7, MeeGo N9 [landscape]"
		},
		{
			"aspectRatio": 0.625,
			"name":"16:10 Android devices, WindowsPhone7 [portrait]"
		},
		{
			"aspectRatio": 1.6,
			"name":"16:10 Android devices, WindowsPhone7 [landscape]"
		},
		{
			"aspectRatio": 0.588235294,
			"name":"17:10 Galaxy Tab 7 [portrait]"
		},
		{
			"aspectRatio": 1.706666667,
			"name":"17:10 Galaxy Tab 7 [landscape]"
		}
	]
});
