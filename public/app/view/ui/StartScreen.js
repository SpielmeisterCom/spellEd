Ext.define('Spelled.view.ui.StartScreen' ,{
    extend: 'Ext.Window',
    title : 'Load or Create a Project',

    alias: 'widget.startscreen',

	layout: 'fit',

    modal : true,
    closable: false,

    items: [
        {
            bodyPadding: 10,
            xtype: 'form',
            items: [
                {
                    xtype: 'button',
                    text: 'Load a existing Project',
                    action: "showLoadProject"
                },
                {
                    xtype: 'button',
                    text: 'Create a new Project',
                    action: "showCreateProject"
                }
            ]
        }
    ]
});