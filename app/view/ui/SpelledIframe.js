Ext.define('Spelled.view.ui.SpelledIframe', {
    extend: 'Ext.container.Container',
    alias : 'widget.spellediframe',

    width : '100%',
    height: '100%',
    autoEl : {
        tag : 'iframe'
    },

    afterRender: function() {
        this.el.dom.src = 'http://localhost:8080/spellEdShim.html?id='+this.id
    }
});