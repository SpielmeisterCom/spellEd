Ext.define('Spelled.view.menu.contextmenu.templatesList.Entity', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistentitycontextmenu',

    items: [
		{
			icon: 'images/icons/entity-add.png',
			text: 'Add a new Entity to this Entity-Template',
			action: 'add'
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
