Ext.define('Spelled.view.menu.contextmenu.EntityTemplateComponentsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.entitytemplatecomponentscontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
