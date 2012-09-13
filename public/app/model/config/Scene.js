Ext.define('Spelled.model.config.Scene', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
		{ name: 'scriptId', type: 'string', defaultValue: "spell/scene/default" },
		{ name: 'showGrid', type: 'boolean', defaultValue: false },
		{ name: 'systems', type: 'object', defaultValue: { update: [], render: [ 'spell.system.keyInput', 'spell.system.render' ] } }
    ],

    idProperty: 'name',

	associations: [{
		model:"Spelled.model.Project",
		type:"belongsTo",
		getterName: 'getProject',
		setterName: 'setProject'
	}],

    hasMany: {
        model: 'Spelled.model.config.Entity',
        associationKey: 'entities',
        name :  'getEntities'
    },

	getRenderTabTitle: function() {
		return "Rendered: " + this.getId()
	},

	getSourceTabTitle: function() {
		return "Source: " + this.getId()
	},

    constructor: function() {
        this.callParent(arguments)

		if( !!this.raw )
        	Ext.getStore( 'config.Scenes' ).add( this )
    },

    getJSONConfig: function() {

        var result = Ext.clone( this.data )

        result.entities = []
		this.getEntities().each( function( entity ) {
            result.entities.push( entity.getJSONConfig() )
        })

        return result
    },

	appendOnTreeNode: function( node ) {
		var sceneNode = node.appendChild(
			node.createNode( {
					text      : 'Scene "' + this.getId() + '"',
					id        : this.getId(),
					iconCls   : "tree-scene-icon",
					leaf      : false
				}
			)
		)

		var entitiesNode = sceneNode.appendChild(
			node.createNode( {
					text      : "Entities",
					id        : "entities",
					iconCls   : "tree-entities-folder-icon",
					leaf      : false
				}
			)
		)

		this.getEntities().each( function( entity ) {
			entitiesNode.appendChild(
				entity.createTreeNode( entitiesNode )
			)
		})

		sceneNode.appendChild(
			node.createNode( {
					text      : "Systems",
					id        : "showSystems",
					iconCls   : "tree-scene-system-icon",
					leaf      : true
				}
			)
		)

		sceneNode.appendChild(
			node.createNode( {
					text      : "Script",
					id        : "showScript",
					iconCls   : "tree-scene-script-icon",
					leaf      : true
				}
			)
		)

		return sceneNode
	}
});
