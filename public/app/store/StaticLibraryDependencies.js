Ext.define('Spelled.store.StaticLibraryDependencies', {
    extend: 'Ext.data.Store',

    fields: [ 'id' ],

    data : [
		{
			"id": "spell.component.entityMetaData"
		},
		{
			"id": "spell.component.entityComposite.parent"
		},
		{
			"id": "spell.component.eventHandlers"
		}
    ]
});

