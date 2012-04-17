Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    closable: true,
    closeAction: 'hide',

    onRender: function() {
        this.callParent(arguments)
    }
});