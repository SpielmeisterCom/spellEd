Ext.define('Spelled.store.dependencies.library.Static', {
    extend: 'Ext.data.Store',

    fields: [ 'id', { type: 'boolean', name: 'debugOnly', defaultValue: false } ],

    data : [
		{
			"id": "spell.component.metaData"
		},
		{
			"id": "spell.component.composite"
		},
		{
			"id": "spell.component.eventHandlers"
		},
		{
			"id": "spell.system.debug.camera",
			debugOnly: true
		},
		{
			"id": "spell.component.editorConfiguration",
			debugOnly: true
		},
		{
			"id": "spell.OpenSans14px",
			debugOnly: true
		},
		{
			"id": "spell.remove",
			debugOnly: true
		}
    ]
});

