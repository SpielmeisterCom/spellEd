Ext.define('Spelled.view.system.List' ,{
	extend: 'Spelled.abstract.view.TreeList',
	alias : 'widget.systemlist',
	animate: false,
	animCollapse: false,

	rootVisible: false,

	docString: "#!/guide/concepts_systems-section-4",

	viewConfig: {
		plugins: {
			ptype: 'treeviewdragdrop'
		}
	},

    tbar: [
        {
            text: "Add system",
			icon: "images/icons/system-add.png",
            action: "showAddSystem"
        }
    ]
});
