Ext.define('Spelled.view.library.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.librarytreelist',

	requires: [
		'Ext.container.ButtonGroup'
	],

    animate: false,
    animCollapse: false,
    store : 'Library',

    rootVisible: false,

	tbar: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: { xtype: 'librarymenu' }
		}
	]
});