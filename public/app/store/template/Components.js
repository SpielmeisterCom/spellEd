Ext.define('Spelled.store.template.Components', {
	extend: 'Spelled.abstract.store.Template',

	model: 'Spelled.model.template.Component',

	filters: [
		function( item ) {
			var internalSpellComponents = [
				'spell.component.entityComposite.root',
				'spell.component.entityComposite.children',
				'spell.component.name'
			]

			return !Ext.Array.contains( internalSpellComponents, item.getFullName() )
		}
	]
});
