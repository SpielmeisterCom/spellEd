Ext.define('Spelled.model.config.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'name',
		'scriptId',
		{ name: 'systems', type: 'object', defaultValue: { update: [], render: [] } }
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
        Ext.getStore( 'config.Zones' ).add( this )
    },

    getJSONConfig: function() {

        var result = this.data
        var entities = this.getEntities()

        result.entities = []
        entities.each( function( entity ) {
            result.entities.push( entity.getJSONConfig() )
        })

        return result
    },

	appendOnTreeNode: function( node ) {
		var zoneNode = node.appendChild(
			node.createNode( {
					text      : this.getId(),
					id        : this.getId(),
					iconCls   : "tree-zone-icon",
					leaf      : false
				}
			)
		)

		var entitiesNode = zoneNode.appendChild(
			node.createNode( {
					text      : "Entities",
					id        : "entities",
					leaf      : false
				}
			)
		)

		this.getEntities().each( function( entity ) {
			entitiesNode.appendChild(
				node.createNode( {
						text      : entity.get('name'),
						id        : entity.getId(),
						iconCls   : "tree-zone-entity-icon",
						leaf      : true
					}
				)
			)
		})

		zoneNode.appendChild(
			node.createNode( {
					text      : "Systems",
					id        : "showSystems",
					iconCls   : "tree-zone-system-icon",
					leaf      : true
				}
			)
		)

		zoneNode.appendChild(
			node.createNode( {
					text      : "Script",
					id        : "showScript",
					iconCls   : "tree-zone-script-icon",
					leaf      : true
				}
			)
		)

		return zoneNode
	}
});