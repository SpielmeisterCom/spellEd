Ext.define('Spelled.view.menu.contextmenu.ScenesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.sceneslistcontextmenu',

    items: [
        {
	        icon: 'images/icons/scene-key.png',
	        text: 'Set Start Scene',
            action: 'default'
        },
        {
			icon: 'resources/images/icons/scene-go.png',
            text: 'Render Scene',
            action: 'render'
        },
        {
			icon: 'resources/images/icons/scene-delete.png',
            text: 'Remove Scene',
            action: 'remove'
		}
    ]
});
