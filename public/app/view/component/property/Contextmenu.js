Ext.define('Spelled.view.component.property.Contextmenu', {
    extend: 'Spelled.base.view.Menu',
    alias : 'widget.componentpropertycontextmenu',

    items: [
		{ xtype: 'menuitemcopyid' },
        {
			icon: 'resources/images/icons/revert-component.png',
            text: 'Reset to component defaults',
            action: 'toComponentDefaults'
        },
		{
			hidden: true,
			icon: 'resources/images/icons/revert-template.png',
			text: 'Reset to template defaults',
			action: 'toEntityDefaults'
		},
		{
			hidden: true,
			icon: 'resources/images/icons/component-delete.png',
			text: 'Remove component',
			action: 'removeComponent'
		}
    ]
});
