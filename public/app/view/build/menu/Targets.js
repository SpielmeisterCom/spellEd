Ext.define('Spelled.view.build.menu.Targets' ,{
    extend: 'Ext.menu.Menu',
    alias: 'widget.buildtargetsmenu',

	defaults: {
		disabled: true
	},

	items:[
		{
			text   : 'All',
			target : 'all'
		},
		{
			text   : 'Web',
			target : 'web'
		},
		{
			text   : 'Android',
			target : 'android'
		},
		{
			text   : 'iOS',
			target : 'ios'
		}
	]
});