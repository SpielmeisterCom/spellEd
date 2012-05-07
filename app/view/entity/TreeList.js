Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',
    animate: false,
    animCollapse: false,

    rootVisible: false,

    title: "Default Entities",
    store: "EntitiesTree",

    tbar: [
        {
            text: "Create",
            action: "showCreateEntity",
            tooltip: {
                text:'Create a new Entity',
                title:'Create'
            }
        }
    ]
});