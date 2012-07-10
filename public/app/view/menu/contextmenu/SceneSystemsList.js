Ext.define('Spelled.view.menu.contextmenu.SceneSystemsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scenesystemslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Add new system',
            action: 'add'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
