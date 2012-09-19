Ext.define('Spelled.store.TemplatesTree', {
    extend: 'Spelled.abstract.store.TreeStore',

    root: {
        expanded: true
    },
	listeners: {
		load: function( store, node ) {
			this.parseNode( node )
		}
	},

	parseNode: function( node ) {
		if( node.get('cls') === 'entityTemplate' ) {
			var entityTemplate  = Ext.getStore( 'template.Entities' ).getById( node.getId() )
			entityTemplate.createTreeNode( node )
		}

		node.eachChild( this.parseNode, this )
	}
});
