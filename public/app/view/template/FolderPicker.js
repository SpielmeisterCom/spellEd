Ext.define('Spelled.view.template.FolderPicker', {
    extend: 'Spelled.abstract.view.FolderPicker',
    xtype: 'templatefolderpicker',

    initComponent: function() {
        this.store = Ext.getStore("template.FoldersTree")
        this.callParent(arguments)
    }
});
