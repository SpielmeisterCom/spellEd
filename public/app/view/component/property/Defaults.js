Ext.define('Spelled.view.component.property.Defaults', {
    extend: 'Spelled.abstract.view.Menu',
    alias : 'widget.componentpropertydefaultscontextmenu',

    items: [
        {
			icon: 'images/icons/revert-component.png',
            text: 'Reset to component defaults',
            action: 'toComponentDefaults'
        }
    ]
});
