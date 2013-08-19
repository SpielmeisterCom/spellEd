Ext.define('Spelled.view.ui.StartScreen' ,{
    extend: 'Ext.Window',
    title : 'Open or Create Project',

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
                    text: 'Open Project',
                    action: "showLoadProject"
                },
                {
                    xtype: 'button',
                    text: 'Create new Project',
                    action: "showCreateProject",
					tooltip: Spelled.Configuration.getDemoTooltipText(),
					disabled: Spelled.Configuration.isDemoInstance()
                }
            ]
        }
    ]
});
