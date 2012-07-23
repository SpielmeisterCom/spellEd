Ext.define('Spelled.view.ui.SpelledIframe', {
    extend: 'Ext.container.Container',
    alias : 'widget.spellediframe',

    width : '100%',
    height: '100%',
    autoEl : {
		tag : 'iframe',
		border: '0',
		frameborder: '0',
		scrolling: 'no'
    },

    afterRender: function() {
        this.el.dom.src = 'http://localhost:8080/' + this.projectName + '/spellEdShim.html?iframeId='+this.id
		this.focus()
    }
});
