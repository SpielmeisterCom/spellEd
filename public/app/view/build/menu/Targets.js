Ext.define('Spelled.view.build.menu.Targets' ,{
    extend: 'Ext.menu.Menu',
    alias: 'widget.buildtargetsmenu',

	items:[
		{
			text   : 'All',
			target : 'all',
			disabled: true
		},
		{
			text   : 'Web',
			target : 'web'
		},
		{
			text   : 'Android',
			target : 'android',
			disabled: true
		},
		{
			text   : 'iOS',
			target : 'ios',
			disabled: true
		}
	]
});