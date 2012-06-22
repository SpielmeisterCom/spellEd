Ext.define('Spelled.view.template.entity.Components' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.entitytemplatecomponentslist',

    title: 'Components',
    flex: 1,

    bbar: [
        {
            text: "Add",
            action: "showAddComponent"
        }
    ]
});
