Ext.define('Spelled.view.menu.contextmenu.AssetsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.assetslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new Asset',
            action: 'create'
        },
		{
			icon: 'images/icons/cog.png',
			text: 'Edit',
			action: 'edit'
		},
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
		}
    ]
});