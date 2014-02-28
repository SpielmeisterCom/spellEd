describe( "Projects controller", function() {

    it( "has been added to Spelled application", function() {
        expect( Spelled.app.getController( 'Projects' ) ).to.exist
    })

//    it( "should listen to global save event", function() {
//        var app                = Spelled.app,
//            projectsController = app.getController( 'Projects'),
//            templateSystem     = app.getController( 'templates.Systems' )
//
//        var spy1 = sinon.spy( projectsController, 'globalSave' ),
//            spy2 = sinon.spy( templateSystem, 'saveAllSystemScriptsInTabs' )
//
//        app.fireEvent( 'globalsave' )
//
//        assert( spy1.calledOnce === true, 'Projects controller received global save event' )
//        assert( spy2.calledOnce === true, 'Template system controller received global save event' )
//    })
})
