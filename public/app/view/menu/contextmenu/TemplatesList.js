Ext.define('Spelled.view.menu.contextmenu.TemplatesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new Template',
            action: 'create'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
