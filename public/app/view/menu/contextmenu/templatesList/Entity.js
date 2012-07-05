Ext.define('Spelled.view.menu.contextmenu.templatesList.Entity', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistentitycontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new Template',
            action: 'create'
        },
		{
			icon: 'images/icons/add.png',
			text: 'Add a new Entity to this Entity-Template',
			action: 'add'
		},
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
