Ext.define('Spelled.view.menu.contextmenu.BlueprintsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.blueprintslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new Blueprint',
            action: 'create'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});