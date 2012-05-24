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
        'assetId',
        'name',
        'type',
        'mimeType',
        'namespace',
        'extension'
    ],

    getFilePath: function( projectName ) {
        return projectName + "/library/assets/" + this.get('assetId')
    }
});