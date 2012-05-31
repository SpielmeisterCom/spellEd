Ext.define('Spelled.view.blueprint.Editor', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.blueprinteditor',

    title: 'Blueprint Editor',
    titleCollapse: false,
    activeTab: 0,
    bbar: [
        {
            xtype: 'button',
            action: 'showCreateBlueprint',
            text: 'Create a new Blueprint'
        }
    ]
});