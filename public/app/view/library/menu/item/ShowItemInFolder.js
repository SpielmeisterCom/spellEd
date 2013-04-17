Ext.define('Spelled.view.library.menu.item.ShowItemInFolder', {
    extend: 'Ext.menu.Item',
    alias : 'widget.menuitemshowinfolder',
	hidden: !Spelled.Configuration.isNodeWebKit(),

	icon: 'resources/images/icons/cog.png',
	text: 'Show folder content'
});