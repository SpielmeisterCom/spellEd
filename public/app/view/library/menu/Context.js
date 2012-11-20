Ext.define('Spelled.view.library.menu.Context', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.librarycontextmenu',

    items: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: { xtype: 'librarymenu' }
		}
    ]
});