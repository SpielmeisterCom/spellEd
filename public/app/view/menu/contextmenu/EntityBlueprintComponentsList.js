Ext.define('Spelled.view.menu.contextmenu.EntityBlueprintComponentsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.entityblueprintcomponentscontextmenu',

    items: [
        {
            text: 'Remove',
            action: 'remove'
        }
    ]
});