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

    models: [
        'Asset'
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
            },
            'createasset button[action="createAsset"]' : {
                click: this.createAsset
            }
        })
    },

    setProjectNameOfAssetProxy: function( projectName ) {
        var store    = this.getAssetsTreeStore()

        store.setProxy(
            {
                type: 'direct',
                directFn: Spelled.AssetsActions.getTree,
                paramOrder: ['node', 'projectName'],
                extraParams: {
                    projectName: projectName
                }
            }
        )

        this.refreshList()
    },

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject(),
            me      = this

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Uploading your asset...',
                    success: function( fp, o ) {
                        Ext.Msg.alert('Success', 'Your asset "' + o.result.data.name + '" has been uploaded.')

                        me.refreshList()

                        window.close()
                    }
                }
            )
        }
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
            title     = record.internalId

        var Asset = this.getAssetModel()

        var foundTab = this.application.findActiveTabByTitle( assetEditor, title )

        if( foundTab )
            return assetEditor.setActiveTab( foundTab )

        Asset.load( record.internalId , {
            scope: this,
            success: function( asset ) {

                var assetPath = asset.get('path')

                //TODO: remove after we know how the project files get accessed
                assetPath = assetPath.substring(
                    assetPath.indexOf( this.application.getActiveProject().get('name') )
                )

                var View = this.getAssetIframeView()
                var view = new View( {
                    title: title,
                    autoEl: {
                        tag : 'iframe',
                        src: assetPath
                    }
                } )

                this.application.createTab( assetEditor, view )
            }
        })
    },

    refreshList: function() {
        var store    = this.getAssetsTreeStore()

        store.load()
    },

    showAssets : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('AssetEditor').show()
    }
});