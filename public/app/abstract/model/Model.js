Ext.define('Spelled.abstract.model.Model', {

	sortOrder: 9,

	insertMetaData: function( storeId, type ) {
		var metaData = Ext.getStore( storeId ).findRecord( 'type', type )

		if ( metaData ) {
			this.iconCls   = metaData.data.iconCls
			this.sortOrder = metaData.data.sortOrder
		}
	},

	generateIdentifier: function( object ) {
		return Spelled.Converter.namespaceFromObject( object )
	},

	createTreeNode: function( node ) {
		return node.appendChild(
			node.createNode( {
				text   : this.get( 'name' ),
				cls    : this.get( 'subtype' ) || this.get( 'type' ),
				sortOrder : this.sortOrder,
				libraryId : this.getFullName(),
				iconCls: this.iconCls,
				leaf   : true,
				id     : this.getId()
			} )
		)
	},

	fireDirtyEvent: function() {
console.log( "wanne fire event " + this.getFullName() )
		this.fireEvent( 'dirty', this )
	},

	updateDependencies: function() {
console.log( "DepUp: "+ this.getFullName() )
		var oldDependencies = this.get( 'dependencies' ) || [],
			newDependencies = this.getCalculatedDependencies(),
			ArrayHelper     = Ext.Array

		if( oldDependencies.length != newDependencies.length || ArrayHelper.difference( oldDependencies, newDependencies ).length > 0 ) {
			var allDependencies = ( this.mergeDependencies ) ? ArrayHelper.merge( oldDependencies, newDependencies ) : newDependencies

			this.set( 'dependencies', ArrayHelper.unique( ArrayHelper.clean( allDependencies ) ).sort() )
		} else {
			this.set( 'dependencies', oldDependencies )
		}
	},

	getAccordingJSFileName: function() {
		return this.get('id').replace( /\.json$/, ".js" )
	}
});
