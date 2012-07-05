Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scenetreelist',

    animate: false,
    animCollapse: false,
    title : 'Scenes in this project',
    store : 'ScenesTree',

    rootVisible: false,

    tbar: [
        {
            text: "Add new scene",
            action: "showCreateScene",
	        icon: 'images/icons/scene-add.png',
            tooltip: {
                text:'Create a new Scene',
                title:'Create'
            }
        }
	]
});
