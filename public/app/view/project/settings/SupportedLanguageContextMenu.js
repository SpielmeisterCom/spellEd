Ext.define('Spelled.view.project.settings.SupportedLanguageContextMenu', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.supportedlanguagecontextmenu',

    items: [
		{
			text: 'Remove',
			action: 'remove',
			icon: 'images/icons/delete.png'
		}
    ]
});