Ext.define('Spelled.view.menu.contextmenu.templatesList.EntityComposite', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.templateslistentitycompositecontextmenu',

    items: [
		{
			icon: 'images/icons/entity-add.png',
			text: 'Add Entity to Entity Template',
			action: 'add'
		}
    ]
});
