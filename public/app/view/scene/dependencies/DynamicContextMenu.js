Ext.define('Spelled.view.scene.dependencies.DynamicContextMenu', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.dynamiclibraryitemcontextmenu',

    items: [
		{
			text: 'Show in library',
			action: 'showInLibrary',
			icon: 'images/icons/deep_link.png'
		},
		{
			text: 'Remove',
			action: 'remove',
			icon: 'images/icons/delete.png'
		}
    ]
});