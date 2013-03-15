Ext.define('Spelled.view.menu.contextmenu.ScriptsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scriptslistcontextmenu',

    items: [
		{
			icon: 'resources/images/icons/script-edit.png',
			text: 'Edit',
			action: 'edit'
		},
		{
			icon: 'resources/images/icons/script-delete.png',
			text: 'Remove',
			action: 'remove'
		}
    ]
});