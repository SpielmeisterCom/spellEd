Ext.define('Spelled.view.menu.contextmenu.ComponentBlueprintAttributesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.componentblueprintattributescontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});