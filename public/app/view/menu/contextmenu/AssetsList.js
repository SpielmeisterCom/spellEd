Ext.define('Spelled.view.menu.contextmenu.AssetsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.assetslistcontextmenu',

    items: [
		{
			icon: 'resources/images/icons/cog.png',
			text: 'Edit',
			action: 'edit'
		},
		{
			icon: 'resources/images/icons/rename.png',
			text: 'Rename',
			action: 'rename'
		},
        {
			icon: 'resources/images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
		}
    ]
});