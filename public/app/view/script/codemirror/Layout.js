Ext.define('Spelled.view.script.codemirror.Layout', {
	extend: 'Ext.layout.component.field.Field',
	alias: ['layout.codemirror'],

	type: 'codemirror',

	toolbarSizePolicy: {
		setsWidth: 0,
		setsHeight: 0
	},

	beginLayout: function(ownerContext) {
		this.callParent(arguments);

		ownerContext.textAreaContext = ownerContext.getEl('textareaEl');
		ownerContext.editorContext   = ownerContext.getEl('editorEl');
		ownerContext.toolbarContext  = ownerContext.context.getCmp(this.owner.getToolbar());
	},

	renderItems: Ext.emptyFn,

	getItemSizePolicy: function (item) {

		return this.toolbarSizePolicy;
	},

	getLayoutItems: function () {
		var toolbar = this.owner.getToolbar();

		return toolbar ? [toolbar] : [];
	},

	getRenderTarget: function() {
		return this.owner.bodyEl;
	},

	publishInnerHeight: function (ownerContext, height) {
		var me = this,
			innerHeight = height - me.measureLabelErrorHeight(ownerContext) -
				ownerContext.toolbarContext.getProp('height') -
				ownerContext.bodyCellContext.getPaddingInfo().height;


		if (Ext.isNumber(innerHeight)) {
			ownerContext.textAreaContext.setHeight(innerHeight);
			ownerContext.editorContext.setHeight(innerHeight);
		} else {
			me.done = false;
		}

		// hide the toolbar if there is no button visible
		if(this.owner.toolbar.items.length == 0){
			this.owner.toolbar.hide();
		}
	},

	publishInnerWidth: function (ownerContext, width) {
		var me = this;

		if (Ext.isNumber(width)) {
			ownerContext.textAreaContext.setWidth(width);
			ownerContext.editorContext.setWidth(width);
		} else {
			me.done = false;
		}
	}
});