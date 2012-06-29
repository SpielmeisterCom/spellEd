Ext.define('Spelled.model.template.Entity', {
    extend: 'Spelled.abstract.model.Template',

    fields: [
        "type",
        "namespace",
        "name"
    ],

	associations: [
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Component',
			associationKey: 'components',
			name :  'getComponents'
		},
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Entity',
			associationKey: 'children',
			name :  'getChildren'
		},
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity'
		}
	],

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

	proxy: {
        type: 'direct',
        api: {
            create:  Spelled.EntityTemplateActions.create,
            read:    Spelled.EntityTemplateActions.read,
            update:  Spelled.EntityTemplateActions.update,
            destroy: Spelled.EntityTemplateActions.destroy
        },
        writer: {
            type: 'json'
        }
    }
});
