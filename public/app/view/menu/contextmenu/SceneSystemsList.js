Ext.define('Spelled.view.menu.contextmenu.SceneSystemsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scenesystemslistcontextmenu',

    items: [
		{
			icon: 'images/icons/arrow-up.png',
			text: 'Move up',
			action: 'moveUp'
		},
		{
			icon: 'images/icons/arrow-down.png',
			text: 'Move down',
			action: 'moveDown'
		},
		{
			icon: 'images/icons/system-delete.png',
			text: 'Remove',
			action: 'remove'
		}
    ]
});
