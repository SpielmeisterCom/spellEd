Ext.define('Spelled.view.menu.contextmenu.ScriptsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scriptslistcontextmenu',

    items: [
        {
            text: 'Create a new Script',
            action: 'create'
        },
        {
            text: 'Remove',
            action: 'remove'
        }
    ]
});