Ext.define('Spelled.view.ui.SpelledAboutConfiguration' ,{
    extend: 'Ext.grid.property.Grid',
    alias: 'widget.spelledaboutconfiguration',

    title : 'SpellEd Configuration',

    listeners: {
        'beforeedit': {
            fn: function(){
                return false;
            }
        }
    },

    initComponent: function() {
        Ext.applyIf( this, {
            source: {
                version:                      Spelled.Configuration.version,
                buildNumber:                  Spelled.Configuration.buildNumber,
                buildTimeStamp:               Spelled.Configuration.buildTimeStamp,
                storageVersion:               Spelled.Configuration.storageVersion,
                workspacePath:                Spelled.Configuration.getWorkspacePath(),
                spellCliPath:                 Spelled.Configuration.getSpellCliPath(),
                spellCorePath:                Spelled.Configuration.getSpellCorePath(),
                documentationServerUrl:       Spelled.Configuration.getDocumentationServerUrl(),
                updateServerUrl:              Spelled.Configuration.updateServerUrl,
                isDemoInstance:               Spelled.Configuration.isDemoInstance(),
                isDevEnvironment:             Spelled.Configuration.isDevEnvironment(),
                isInNodeWebkitDevEnvironment: Spelled.Configuration.isInNodeWebkitDevEnvironment()
            }
        })

        this.callParent( arguments )
    }
})