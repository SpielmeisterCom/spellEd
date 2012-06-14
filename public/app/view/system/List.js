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
            text: "Add",
            action: "showAddSystem",
            tooltip: {
                text:'Adds a new System to the Zone',
                title:'Add'
            }
        }
    ]
});