Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scenetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Scenes',
    store : 'ScenesTree',

    rootVisible: false,

    tbar: [
        {
            text: "Create Scene",
            action: "showCreateScene",
            tooltip: {
                text:'Create a new Scene',
                title:'Create'
            }
        }
	]
});
