Ext.define('Spelled.view.scene.dependencies.StaticContextMenu', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.staticlibraryitemcontextmenu',

    items: [
		{
			text: 'Show in library',
			action: 'showInLibrary',
			icon: 'resources/images/icons/deep_link.png'
		}
    ]
});