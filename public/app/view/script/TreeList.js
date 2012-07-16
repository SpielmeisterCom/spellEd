Ext.define('Spelled.view.script.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scriptstreelist',

    animate: false,
    animCollapse: false,
    title : 'All Scripts',
    store : 'script.Tree',

    rootVisible: false,

	tbar: [
		{
			xtype: 'button',
			icon: "images/icons/add.png",
			action: 'showCreateScript',
			text: 'Create a new Script'
		}
	]
});
