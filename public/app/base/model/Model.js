Ext.define('Spelled.base.model.Model', {

	sortOrder: 9,

	dirtyDep: true,

	insertMetaData: function( storeId, type ) {
		var metaData = Ext.getStore( storeId ).findRecord( 'type', type, null, null, null, true )

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

	needToCalcCependency: function() {
		this.dirtyDep = true
	},

	fireDirtyEvent: function() {
		this.fireEvent( 'dirty', this )
	},

	getDependencies: function( addMissing ) {
		//TODO: should be changed if dependencies in spell are inserted
		this.set( 'dependencies', [] )
		return this.get( 'dependencies' ) || []
	},

	getDependencyNode: function() {
		return { libraryId: this.getFullName(), id: this.getFullName() }
	},

	getAccordingJSFileName: function() {
		return this.get('id').replace( /\.json$/, ".js" )
	},

	readAccordingJSFile: function() {
		if( !this.get( 'id' ) ) return

		var path = this.getAccordingJSFileName()

		Spelled.StorageActions.read( { id: path },
			function( result ) {
				this.set( 'path', path )
				this.set( 'content', result )
				this.dirty = false
			},
			this
		)
	}
});
