Ext.define('Spelled.view.menu.contextmenu.EntityBlueprintComponentsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.entityblueprintcomponentscontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});