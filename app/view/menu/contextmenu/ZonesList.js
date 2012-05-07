Ext.define('Spelled.view.menu.contextmenu.ZonesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.zoneslistcontextmenu',

    items: [
        {
            text: 'Set to default Zone',
            action: 'default'
        },
        {
            text: 'Render Zone',
            action: 'render'
        },
        {
            text: 'Edit sourcecode',
            action: 'edit'
        },
        {
            text: 'Remove',
            action: 'remove'
        }
    ]
});