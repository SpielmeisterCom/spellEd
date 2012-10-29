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
			icon: 'images/icons/entity-add.png',
			text: 'Add new child entity',
			action: 'create'
		},
		{
			icon: 'images/icons/entity-rename.png',
			text: 'Rename the entity',
			action: 'rename'
		},
		{
			icon: 'images/icons/entity-clone.png',
			text: 'Clone this entity',
			action: 'clone'
		},
		{
			icon: 'images/icons/entity-delete.png',
            text: 'Remove',
            action: 'remove'
		}
    ]
});