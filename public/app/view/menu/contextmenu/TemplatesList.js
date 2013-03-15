Ext.define('Spelled.view.menu.contextmenu.TemplatesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistcontextmenu',

    items: [
		{
			icon: 'resources/images/icons/application_go.png',
			text: 'Open',
			action: 'open'
		},
        {
			icon: 'resources/images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
