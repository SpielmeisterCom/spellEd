Ext.define('Spelled.view.blueprint.FolderPicker', {
    extend: 'Spelled.abstract.view.FolderPicker',
    xtype: 'blueprintfolderpicker',

    initComponent: function() {
        this.store = Ext.getStore("blueprint.FoldersTree")
        this.callParent(arguments)
    }
});