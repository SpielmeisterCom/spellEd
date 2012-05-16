Ext.define('Spelled.view.asset.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.assetstreelist',

    animate: false,
    animCollapse: false,
    title : 'All Assets',
    store : 'AssetsTree',

    rootVisible: false
});