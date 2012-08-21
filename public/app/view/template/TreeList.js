Ext.define('Spelled.view.template.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.templatestreelist',

	title: "Template - Navigator",
	header: false,

    animate: false,
    animCollapse: false,
    store : 'TemplatesTree',

    rootVisible: false,

	tbar: [
	{
		icon: "images/icons/add.png",
		action: 'showCreateTemplate',
		text: 'Create new template'
	}
]
});
