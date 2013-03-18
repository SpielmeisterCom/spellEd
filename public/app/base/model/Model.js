Ext.define('Spelled.base.model.Model', {

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
		this.fireEvent( 'dirty', this )
	},

	getDependencies: function() {
		//TODO: should be changed if dependencies in spell are inserted
		var oldDependencies = this.get( 'dependencies' ) || [],
			newDependencies = this.getCalculatedDependencies()

		return ( this.mergeDependencies ) ? Ext.Array.merge( oldDependencies, newDependencies ) : newDependencies
	},

	updateDependencies: function() {
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
	},

	writeAccordingJSFile: function() {
		if( !this.get( 'id' ) ) return

		Spelled.StorageActions.read( { id: this.getAccordingJSFileName() },
			function( result ) {
				this.set( 'path', this.getAccordingJSFileName() )
				this.set( 'content', result )
				this.dirty = false
			},
			this
		)
	}
});
