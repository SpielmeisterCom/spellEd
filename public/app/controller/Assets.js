Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
        'asset.Navigator',
        'asset.Editor',
        'asset.TreeList',
        'asset.Iframe',
        'asset.Upload'
    ],

    stores: [
        'AssetsTree'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
            'assetsnavigator': {
                activate: this.showAssets
            },
            'assetstreelist': {
                itemdblclick: this.openAsset
            },
            'AssetEditor': {
                dragover: this.dropAsset
            },
            'asseteditor [action="showCreateAsset"]' : {
                click: this.showCreateAsset
            }
        })
    },

    dropAsset: function() {
        console.log( arguments )
        console.log( "Dropped item in asset editor" )

        e.stopPropagation()
        e.preventDefault()
    },

    showCreateAsset: function() {
        var View = this.getAssetUploadView()
        var view = new View( )
        view.show()
    },

    openAsset: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var assetEditor = Ext.getCmp('AssetEditor'),
            assetPath = record.internalId,
            title     = record.internalId

        //TODO: remove after we know how the project files get accessed
        assetPath = assetPath.substring(
            assetPath.indexOf( this.application.getActiveProject().get('name') )
        )

        var foundTab = this.application.findActiveTabByTitle( assetEditor, title )

        if( foundTab )
            return assetEditor.setActiveTab( foundTab )

        var View = this.getAssetIframeView()
        var view = new View( {
            title: title,
            autoEl: {
                tag : 'iframe',
                src: assetPath
            }
        } )

        this.application.createTab( assetEditor, view )
    },

    showAssets : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('AssetEditor').show()
    }
});