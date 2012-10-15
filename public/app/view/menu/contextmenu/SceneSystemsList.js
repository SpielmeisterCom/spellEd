Ext.define('Spelled.view.menu.contextmenu.SceneSystemsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scenesystemslistcontextmenu',

	items: [
		{
			icon: 'images/icons/system-add.png',
			text: 'Add system',
			action: 'showAddSystem'
		}
	]
});
