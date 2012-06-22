Ext.define('Spelled.view.menu.contextmenu.SceneSystemsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scenesystemslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Add a new Script',
            action: 'add'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
