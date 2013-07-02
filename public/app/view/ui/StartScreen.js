Ext.define('Spelled.view.ui.StartScreen' ,{
    extend: 'Ext.Window',
    title : 'Open or Create a Project',

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
                    text: 'Open an existing Project',
                    action: "showLoadProject"
                },
                {
                    xtype: 'button',
                    text: 'Create a new Project',
                    action: "showCreateProject",
					tooltip: Spelled.Configuration.getDemoTooltipText(),
					disabled: Spelled.Configuration.isDemoInstance()
                }
            ]
        }
    ]
});
