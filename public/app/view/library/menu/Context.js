Ext.define('Spelled.view.library.menu.Context', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.librarycontextmenu',

	ignoreParentClicks: true,

    items: [
		{
			text: 'Create',
			icon: 'resources/images/icons/add.png',
			menu: { xtype: 'librarymenu' }
		},
		{
			hidden: true,
			action: 'deleteFolder',
			text: 'Remove empty folder',
			icon: 'resources/images/icons/delete.png'
		}
    ]
});