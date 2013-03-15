Ext.define('Spelled.view.menu.contextmenu.ComponentTemplateAttributesList', {
    extend: 'Spelled.abstract.view.Menu',
    alias : 'widget.componenttemplateattributescontextmenu',

    items: [
        {
			icon: 'resources/images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
