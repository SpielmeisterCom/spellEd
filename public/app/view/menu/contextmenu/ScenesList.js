Ext.define('Spelled.view.menu.contextmenu.ScenesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.sceneslistcontextmenu',

    items: [
        {
            text: 'Set to default Scene',
            action: 'default'
        },
        {
			icon: 'images/icons/application_go.png',
            text: 'Render Scene',
            action: 'render'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
