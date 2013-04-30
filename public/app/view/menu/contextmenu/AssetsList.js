Ext.define('Spelled.view.menu.contextmenu.AssetsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.assetslistcontextmenu',

    items: [
		{
			xtype: 'menuitemedit'
		},
		{
			xtype: 'menuitemrename'
		},
		{ xtype: 'menuitemcopyid' },
        {
			xtype: 'menuitemremove'
		}
    ]
});