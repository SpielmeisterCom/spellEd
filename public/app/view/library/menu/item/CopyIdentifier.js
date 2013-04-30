Ext.define('Spelled.view.library.menu.item.CopyIdentifier', {
    extend: 'Ext.menu.Item',
    alias : 'widget.menuitemcopyid',

	icon: 'resources/images/icons/copy-identifier.png',
	text: 'Copy identifier to clipboard',
	action: 'copyComponentIdentifier'
});