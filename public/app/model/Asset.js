Ext.define('Spelled.model.Asset', {
    extend: 'Ext.data.Model',

	mixins: ['Spelled.abstract.model.Model'],

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'appearance'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'asset'
		}
	},

    fields: [
        'type',
		'file',
        'namespace',
		'config',
		'name',
		'assetId'
    ],

	destroy: function( options ) {
		if( this.get( 'file' ) ) Spelled.StorageActions.destroy({ id: this.getAbsoluteFilePath() } )

		this.callParent( options )
	},

	createTreeNode: function( node ) {
		return node.appendChild(
			node.createNode( {
				text   : this.get( 'name' ),
				cls    : this.get( 'type' ),
				iconCls: this.iconCls,
				leaf   : true,
				id     : this.getId()
			} )
		)
	},

	getFullName: function() {
		return ( ( this.get('namespace').length > 0 ) ? this.get('namespace') +"."+ this.get('name') : this.get('name') )
	},

	constructor: function() {
		var object  = arguments[0] || arguments[2],
			assetId = object.type + ":" + this.generateIdentifier( object )

		switch( object.type ) {
			case "spriteSheet":
				this.iconCls = "tree-asset-spritesheet-icon"
				break
			case "animation":
				this.iconCls = "tree-asset-2danimation-icon"
				break
			case "appearance":
				this.iconCls = "tree-asset-2dstaticappearance-icon"
				break
			case "font":
				this.iconCls = "tree-asset-2dtextappearance-icon"
				break
			case "sound":
				this.iconCls = "tree-asset-sound-icon"
				break
			case "keyToActionMap":
				this.iconCls = "tree-asset-keyToActionMap-icon"
				break
		}

		this.callParent( arguments )

		this.set( 'internalAssetId', assetId)
	},

	getAbsoluteFilePath: function() {
		return this.getId().replace( ".json", "." + this.get( 'file' ).split( "." ).pop() )
	},

    getFilePath: function( projectName ) {
		return projectName + "/library/" + this.get( 'file' )
    }
});