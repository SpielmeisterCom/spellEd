Ext.define('Spelled.view.menu.contextmenu.ScriptsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scriptslistcontextmenu',

    items: [
        {
			icon: 'images/icons/script-delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});