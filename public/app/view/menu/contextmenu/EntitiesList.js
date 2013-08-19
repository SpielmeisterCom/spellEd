Ext.define('Spelled.view.menu.contextmenu.EntitiesList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.entitieslistcontextmenu',

    setEntity: function( entity ) {
        this.entity = entity
    },

    getEntity: function() {
        return this.entity
    },

    items: [
		{
			icon: 'resources/images/icons/entity-add.png',
			text: 'Add Child Entity',
			action: 'create'
		},
		{
			icon: 'resources/images/icons/entity-convert.png',
			text: 'Create Template from Entity',
			action: 'showConvertEntity'
		},
		{
			xtype: 'menuitemrename'
		},
		{
			icon: 'resources/images/icons/entity-clone.png',
			text: 'Clone',
			action: 'clone'
		},
		{
			xtype: 'menuitemremove'
		}
    ]
});
