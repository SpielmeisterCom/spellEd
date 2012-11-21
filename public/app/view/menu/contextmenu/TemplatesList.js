Ext.define('Spelled.view.menu.contextmenu.TemplatesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistcontextmenu',

    items: [
		{
			icon: 'images/icons/application_go.png',
			text: 'Open',
			action: 'open'
		},
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
