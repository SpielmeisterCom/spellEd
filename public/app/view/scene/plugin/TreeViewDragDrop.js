Ext.define('Spelled.view.scene.plugin.TreeViewDragDrop' ,{
    extend: 'Spelled.abstract.plugin.TreeViewDragDrop',
	alias: 'plugin.scenetreedragdrop',

	requires: [
		'Spelled.view.scene.plugin.SceneTreeDragZone',
		'Spelled.view.scene.plugin.SceneTreeDropZone'
	],

	expandDelay: 250,
	nodeHighlightOnRepair: false,

	onViewRender : function(view) {
		var me = this,
			scrollEl;

		if (me.enableDrag) {
			if (me.containerScroll) {
				scrollEl = view.getEl();
			}
			me.dragZone = new Spelled.view.scene.plugin.SceneTreeDragZone({
				view: view,
				ddGroup: me.dragGroup || me.ddGroup,
				dragText: me.dragText,
				repairHighlightColor: me.nodeHighlightColor,
				repairHighlight: me.nodeHighlightOnRepair,
				containerScroll: me.containerScroll,
				scrollEl: scrollEl
			});
		}

		if (me.enableDrop) {
			me.dropZone = new Spelled.view.scene.plugin.SceneTreeDropZone({
				view: view,
				ddGroup: me.dropGroup || me.ddGroup,
				allowContainerDrops: me.allowContainerDrops,
				appendOnly: me.appendOnly,
				allowParentInserts: me.allowParentInserts,
				expandDelay: me.expandDelay,
				dropHighlightColor: me.nodeHighlightColor,
				dropHighlight: me.nodeHighlightOnDrop
			});
		}
	}
});


