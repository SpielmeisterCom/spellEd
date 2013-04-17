Ext.define('Spelled.view.menu.contextmenu.AssetsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.assetslistcontextmenu',

    items: [
		{
			xtype: 'menuitemedit'
		},
		{
			xtype: 'menuitemshowinfolder',
			hidden: !Spelled.Configuration.isNodeWebKit()
		},
		{
			xtype: 'menuitemrename'
		},
        {
			xtype: 'menuitemremove'
		}
    ]
});