Ext.define('Spelled.view.system.List' ,{
	extend: 'Spelled.abstract.view.TreeList',
	alias : 'widget.systemlist',
	animate: false,
	animCollapse: false,

	rootVisible: false,

	docString: "#!/guide/system_list_documentation",

	viewConfig: {
		plugins: {
			ptype: 'treeviewdragdrop'
		}
	},

    tbar: [
        {
            text: "Add new system",
			icon: "images/icons/add.png",
            action: "showAddSystem"
        }
    ]
});
