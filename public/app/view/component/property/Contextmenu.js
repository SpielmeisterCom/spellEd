Ext.define('Spelled.view.component.property.Contextmenu', {
    extend: 'Spelled.abstract.view.Menu',
    alias : 'widget.componentpropertycontextmenu',

    items: [
		{
			icon: 'images/icons/copy-identifier.png',
			text: 'Copy identifier to clipboard',
			action: 'copyComponentIdentifier'
		},
        {
			icon: 'images/icons/revert-component.png',
            text: 'Reset to component defaults',
            action: 'toComponentDefaults'
        },
		{
			hidden: true,
			icon: 'images/icons/revert-template.png',
			text: 'Reset to template defaults',
			action: 'toEntityDefaults'
		},
		{
			hidden: true,
			icon: 'images/icons/component-delete.png',
			text: 'Remove component',
			action: 'removeComponent'
		}
    ]
});
