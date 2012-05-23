Ext.define('Spelled.view.menu.contextmenu.AssetsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.assetslistcontextmenu',

    items: [
        {
            text: 'Create a new Asset',
            action: 'create'
        },
        {
            text: 'Remove',
            action: 'remove'
        }
    ]
});