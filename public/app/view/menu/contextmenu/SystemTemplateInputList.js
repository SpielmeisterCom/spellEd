Ext.define('Spelled.view.menu.contextmenu.SystemTemplateInputList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.systemtemplateinputcontextmenu',

    items: [
        {
			icon: 'resources/images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});
