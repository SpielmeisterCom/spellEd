Ext.define('Spelled.view.menu.contextmenu.ZonesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.zoneslistcontextmenu',

    items: [
        {
            text: 'Set to default Zone',
            action: 'default'
        },
        {
			icon: 'images/icons/application_go.png',
            text: 'Render Zone',
            action: 'render'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});