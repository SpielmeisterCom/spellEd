Ext.define('Spelled.model.template.System', {
	extend: 'Spelled.base.model.Template',

	requires: [
		'association.hasone',
		'association.hasmany',
		'Spelled.data.writer.SystemTemplate'
	],

    fields: [
        "namespace",
        "name",
		{ name: "config", type: "object" }
    ],

	iconCls: 'tree-system-icon',

	mergeDependencies: true,

	associations: [
		{
			type: 'hasOne',
			model: 'Spelled.model.Script',
			foreignKey: 'templateId'
		},{
			type: 'hasMany',
			model: 'Spelled.model.template.SystemInputDefinition',
			associationKey: 'input',
			name :  'getInput'
		},{
			type: 'hasMany',
			model: 'Spelled.model.template.SystemConfigItem',
			associationKey: 'config',
			name :  'getConfig'
		}
	],

    proxy: {
        type: 'storageaction',
		extraParams: {
			type: 'system'
		},
        writer: {
            type: 'systemTemplate'
        }
    },

	destroy: function( options ) {
		Spelled.StorageActions.destroy({ id: this.getAccordingJSFileName() } )

		this.callParent( arguments )
	},

	listeners: {
		loadscript: function() {
			this.readAccordingJSFile()
		}
	},

	getConfigForScene: function() {
		var config = {}
		this.getConfig().each(
			function( item ) {
				config[ item.get( 'name' ) ] = item.get( 'default' )
			}
		)

		return config
	},

	constructor: function() {
		this.callParent( arguments )

		if( arguments.length > 1 ) this.fireEvent( 'loadscript' )
	},

    appendOnTreeNode: function( node ) {

        this.getInput().each( function( input ) {

            var children = node.createNode ( {
                text      : input.get('name'),
                id        : input.getId(),
                expanded  : true,
                leaf      : false
            } )


			children.appendChild(
				node.createNode ( {
					text      : input.get('templateId'),
					id        : input.get('templateId'),
					expanded  : true,
					leaf      : true
				} )
			)

            node.appendChild( children )
        })

        return node
    }
});
