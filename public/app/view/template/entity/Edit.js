Ext.define('Spelled.view.template.entity.Edit', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.entitytemplateedit',
    closable: true,

    items: [
        {
			name: 'entityPreviewContainer',
			width : '100%',
			height: '100%',
			xtype: 'container',
			autoEl : {
				tag : 'iframe',
				border: '0',
				frameborder: '0',
				scrolling: 'no'
			},

			afterRender: function() {
				var owner = this.up('entitytemplateedit')

				this.el.dom.src = '/' + owner.projectName + '/public/spellEdShim.html?iframeId='+this.id
				this.focus()
			}
		}
	]
});
