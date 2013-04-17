Ext.define('Spelled.view.menu.contextmenu.ScriptsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scriptslistcontextmenu',

    items: [
		{
			xtype: 'menuitemedit'
		},
		{
			xtype: 'menuitemremove'
		}
    ]
});