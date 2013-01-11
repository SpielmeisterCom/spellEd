Ext.define('Spelled.view.scene.dependencies.StaticContextMenu', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.staticlibraryitemcontextmenu',

    items: [
		{
			text: 'Show in library',
			action: 'showInLibrary',
			icon: 'images/icons/deep_link.png'
		}
    ]
});