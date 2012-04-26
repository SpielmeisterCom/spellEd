Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
            'blueprintsnavigator': {
                activate: this.showBlueprint
            }
        })
    },

    showBlueprint : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('BlueprintEditor').show()
    }
});