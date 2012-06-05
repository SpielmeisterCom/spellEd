Ext.define('Spelled.view.script.FolderPicker', {
    extend: 'Spelled.abstract.view.FolderPicker',
    xtype: 'scriptfolderpicker',

    initComponent: function() {
        this.store = Ext.getStore("script.FoldersTree")
        this.callParent(arguments)
    }
});