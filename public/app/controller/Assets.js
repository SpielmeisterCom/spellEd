Ext.define('Spelled.controller.Assets', {
    extend: 'Ext.app.Controller',

    views: [
        'asset.Navigator',
        'asset.Editor',
        'asset.TreeList',
        'asset.Iframe',
        'asset.Upload',
        'asset.FolderPicker'
    ],

    stores: [
        'asset.Tree',
        'asset.Types',
        'asset.FoldersTree',
        'asset.Textures',
        'asset.Sounds'
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
                itemdblclick: this.openAsset,
                itemcontextmenu: this.showListContextMenu
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

    showListContextMenu: function( view, record, item, index, e, options ) {
        e.stopEvent()

        var menuController = this.application.getController('Spelled.controller.Menu')
        menuController.showAssetsListContextMenu( e )
    },

    setProjectNameOfAssetProxy: function( projectName ) {

        var proxyConfig = {
            type: 'direct',
            directFn: Spelled.AssetsActions.getTree,
            paramOrder: ['node', 'projectName'],
            extraParams: {
                projectName: projectName
            }
        }

        this.getStore("asset.Tree").setProxy(
            proxyConfig
        )

        this.getStore("asset.FoldersTree").setProxy(
            proxyConfig
        )

        this.refreshList()
    },

    createAsset: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject()

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Uploading your asset...',
                    success:
                        Ext.bind(
                            function( fp, o ) {
                                Ext.Msg.alert('Success', 'Your asset "' + o.result.data.name + '" has been uploaded.')

                                this.refreshList()

                                window.close()
                            },
                            this
                        )
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

    removeAsset: function( assetId ) {
        var Asset = this.getModel('Asset')

        Asset.load(
            assetId,
            {
                scope: this,
                success: function( asset ) {
                    asset.destroy()
                    this.refreshList()
                }
            }
        )
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
        this.getStore("asset.Tree").load()
        this.getStore("asset.FoldersTree").load()
        this.getStore("asset.Textures").load()
        this.getStore("asset.Sounds").load()
    },

    showAssets : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('AssetEditor').show()
    }
});