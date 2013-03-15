Ext.define('Spelled.view.menu.contextmenu.SceneSystemsItemList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scenesystemsitemlistcontextmenu',

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
			icon: 'resources/images/icons/application_go.png',
			text: 'Show',
			action: 'open'
		},
		{
			icon: 'resources/images/icons/system-delete.png',
			text: 'Remove',
			action: 'remove'
		}
    ]
});
