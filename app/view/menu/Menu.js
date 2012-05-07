Ext.define('Spelled.view.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.spelledmenu',
    region:'north',

    items: [
        {
            xtype: 'toolbar',
            items: [
                {
                    text: 'Project',
                    menu: {
                        items: [{
                            text   : 'Create',
                            tooltip: 'Creates a new Spell-Project',
                            action: 'createProject'
                        },{
                            text   : 'Load',
                            tooltip: 'Load a existing Spell-Project',
                            action: 'loadProject'
                        }]
                    }
                }
            ]
        }
    ]
});