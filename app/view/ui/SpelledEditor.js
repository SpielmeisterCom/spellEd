Ext.define('Spelled.view.ui.SpelledEditor', {
    extend: 'Ext.ux.AceEditor',


    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
        });

        me.callParent(arguments);

        me.setValue( "function() { test } " , {
            mode: "javascript"
        });
    }
});