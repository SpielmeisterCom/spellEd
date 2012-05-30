Ext.define('Spelled.view.menu.contextmenu.BlueprintsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.blueprintslistcontextmenu',

    items: [
        {
            text: 'Create a new Blueprint',
            action: 'create'
        },
        {
            text: 'Remove',
            action: 'remove'
        }
    ]
});