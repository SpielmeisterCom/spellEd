Ext.define('Spelled.view.asset.FolderPicker', {
    extend: 'Spelled.abstract.view.FolderPicker',
    xtype: 'assetfolderpicker',

    initComponent: function() {
        this.store = Ext.getStore("asset.FoldersTree")
        this.callParent(arguments)
    }
});