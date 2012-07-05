Ext.define('Spelled.view.menu.contextmenu.ScenesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.sceneslistcontextmenu',

    items: [
        {
	        icon: 'images/icons/scene-link.png',
	        text: 'Set to default Scene',
            action: 'default'
        },
        {
			icon: 'images/icons/scene-go.png',
            text: 'Render Scene',
            action: 'render'
        },
        {
			icon: 'images/icons/scene-delete.png',
            text: 'Remove Scene',
            action: 'remove'
        }
    ]
});
