Ext.define('Spelled.view.library.menu.Context', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.librarycontextmenu',

	ignoreParentClicks: true,

    items: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: { xtype: 'librarymenu' }
		}
    ]
});