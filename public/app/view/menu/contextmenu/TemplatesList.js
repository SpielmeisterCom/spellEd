Ext.define('Spelled.view.menu.contextmenu.TemplatesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new template',
            action: 'create'
        },
		{
			icon: 'images/icons/application_go.png',
			text: 'Open template',
			action: 'open'
		},
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
