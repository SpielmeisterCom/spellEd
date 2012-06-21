Ext.define('Spelled.view.menu.contextmenu.ZoneSystemsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.zonesystemslistcontextmenu',

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