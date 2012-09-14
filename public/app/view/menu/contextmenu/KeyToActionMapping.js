Ext.define('Spelled.view.menu.contextmenu.KeyToActionMapping', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.keytoactionmappingcontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
