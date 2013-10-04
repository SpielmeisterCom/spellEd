Ext.define('Spelled.view.menu.contextmenu.EntitiesFolderList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.entitiesfolderlistcontextmenu',

    items: [
		{
			icon: 'images/icons/add.png',
			text: 'Add Entity',
			action: 'create'
		}
    ]
});
