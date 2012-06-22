Ext.define('Spelled.view.menu.contextmenu.ComponentTemplateAttributesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.componenttemplateattributescontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
