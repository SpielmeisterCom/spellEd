Ext.define('Spelled.abstract.model.Model', {

	generateIdentifier: function( object ) {
		var namespace = object.namespace,
			name      = object.name

		return ( !!namespace && namespace.length > 0 ) ? namespace +"."+ name : name
	},

	createTreeNode: function( node ) {
		return node.appendChild(
			node.createNode( {
				text   : this.get( 'name' ),
				cls    : this.get( 'subtype' ),
				iconCls: this.iconCls,
				leaf   : true,
				id     : this.getId()
			} )
		)
	},

	getAccordingJSFileName: function() {
		return this.get('id').replace( /\.json$/, ".js" )
	}
});
