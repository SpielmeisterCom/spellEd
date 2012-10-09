Ext.define('Spelled.store.template.component.KeyFrameComponents', {
	extend: 'Spelled.store.template.Components',

	allowedComponentIds: [
		'spell.component.2d.transform',
		'spell.component.visualObject'
	],

	filters: [
		function( item ) {
			return Ext.Array.contains( item.store.allowedComponentIds, item.getFullName() )
		}
	]
})
