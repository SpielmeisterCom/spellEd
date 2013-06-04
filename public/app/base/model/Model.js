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

	getDependencies: function( addMissing ) {
		//TODO: should be changed if dependencies in spell are inserted
		var oldDependencies = this.get( 'dependencies' ) || [],
			newDependencies = this.getCalculatedDependencies(),
			missing         = Ext.Array.difference( oldDependencies, newDependencies ),
			libraryStore    = Ext.getStore( 'Library' ),
			tmp = []

		Ext.Array.each(
			missing,
			function( item ) {
				var libraryItem = libraryStore.findLibraryItemByLibraryId( item )

				if( addMissing && libraryItem ) {
					Ext.Array.push( tmp, libraryItem.getDependencies( addMissing ) )
				} else if( !libraryItem ) {
					Ext.Array.remove( oldDependencies, item )
				}
			},
			this
		)

		if( addMissing ) oldDependencies = Ext.Array.merge( oldDependencies, tmp )

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
