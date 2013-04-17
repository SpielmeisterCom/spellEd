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
			text: 'Add new child entity',
			action: 'create'
		},
		{
			icon: 'resources/images/icons/entity-convert.png',
			text: 'Convert to template',
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