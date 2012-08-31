Ext.define('Spelled.model.Asset', {
    extend: 'Ext.data.Model',

    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.AssetsActions.create,
            read:    Spelled.AssetsActions.read,
            update:  Spelled.AssetsActions.update,
            destroy: Spelled.AssetsActions.destroy
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

	getFullName: function() {
		return ( ( this.get('namespace').length > 0 ) ? this.get('namespace') +"."+ this.get('name') : this.get('name') )
	},

	constructor: function() {
		this.callParent( arguments )

		var object    = arguments[2],
			namespace = object.namespace,
			name      = object.name,
			assetId   = object.type + ":" + ( ( !!namespace && namespace.length > 0 ) ? namespace +"."+ name : name )

		this.set( 'internalAssetId', assetId)
	},

    getFilePath: function( projectName ) {
        return projectName + "/library/assets/" + this.get('file')
    }
});