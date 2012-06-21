Ext.define('Spelled.view.menu.contextmenu.SystemBlueprintInputList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.systemblueprintinputcontextmenu',

    items: [
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});