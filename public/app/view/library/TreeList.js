Ext.define('Spelled.view.library.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.librarytreelist',

	title: "Library - Navigator",
	header: false,

    animate: false,
    animCollapse: false,
    store : 'Library',

    rootVisible: false,

	tbar: [
		{
			text: "Add new asset",
			action: "showCreateAsset",
			icon: 'images/icons/add.png'
		},
		{
			xtype: 'button',
			icon: "images/icons/script-add.png",
			action: 'showCreateScript',
			text: 'Create new script'
		},
		{
			icon: "images/icons/add.png",
			action: 'showCreateTemplate',
			text: 'Create new template'
		}
	]
});