Ext.define('Spelled.view.system.List' ,{
	extend: 'Spelled.abstract.view.TreeList',
	alias : 'widget.systemlist',
	animate: false,
	animCollapse: false,

	rootVisible: false,

	viewConfig: {
		plugins: {
			ptype: 'treeviewdragdrop'
		}
	},

    tbar: [
        {
            text: "Add new system",
			icon: "images/icons/add.png",
            action: "showAddSystem",
            tooltip: {
                text:'Adds a new System to the Scene',
                title:'Add'
            }
        }
    ]
});
