
/**
* @isTemplate true
* @memberOf Template
* @function onCreated
* @summary Muestra la template para crear el perfil de usuario.
* @param {String} profileFeed Nombre de la template.
* @locus profile
*/
Template.profileFeed.onCreated(function(){
    var self = this;
	/**
	* @isMethod true
	* @memberOf Method
	* @function autorun
	* @summary Metodo para suscribirse en las historias del mismo perfil.
	* @locus profile
	* @param {Object} [username] Nombre de usuario.
	*/
    Tracker.autorun(function(){
        var username = Router.current().params.username;
        self.subscribe("profileStories", username);
    })

})

/**
* @isTemplate true
* @memberOf Template
* @function events
* @summary Template donde almacena los eventos que ocurren en el perfil.
* @locus profile
*/
Template.profileFeed.events({

  /**
	* @isMethod true
	* @memberOf Method
	* @summary Metodo creador de los post en el perfil de usuario.
	* @locus profile
	* @param {String} profileUser Nombre y apellidos del usuario.
	* @param {String} currentUser Usuario conectado.
	* @param {String} story Recoge el texto escrito en el post de la story.
	*/
    'click .new-post':function(e){
        e.preventDefault();
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        var currentUser = Meteor.user();
        var story = $('textarea[name="new-post"]').val();
        if(story.length) {

            Stories.insert({
                createdBy: currentUser._id,
                createdFor: profileUser._id,
                userImage: currentUser.profile.picture.thumbnail,
                storyImage: null,
                storyText: story,
                creatorName: currentUser.profile.name.first + " " + currentUser.profile.name.last,
                creatorUsername: currentUser.profile.login.username,
                creatorThumbnail: currentUser.profile.picture.thumbnail,
                createdForName: profileUser.profile.name.first + " " + profileUser.profile.name.last,
                createdForUsername: profileUser.profile.login.username,
                createdForThumbnail: profileUser.profile.picture.thumbnail,
                likes: [],
                createdAt: new Date(),
                comments: []
            });
            $('textarea[name="new-post"]').val("");
        }

    }

})

/**
	* @isTemplate true
	* @memberOf Template
	* @function helpers
	* @summary Metodo que comprueba el perfil del usuario y propociona informacion del usuario segun los permisos puestos.
	* @locus profile
	*/
Template.profileFeed.helpers({


	/**
	* @isMethod true
	* @memberOf Method
	* @function statusPlaceholder
	* @summary Metodo para detectar si el usuario se encuentra en su perfil para escribir o se encuentra en el perfil de otro usuario para postear.
	* @locus profile
	* @param {String} profileUser Nombre y apellidos del usuario.
	*/
    statusPlaceholder:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        if(profileUser && profileUser._id === Meteor.userId()){
            return "Update your wall";
        } else {
            return "Post to their wall!";
        }
    },

	/**
	* @isMethod true
	* @memberOf Method
	* @function stories
	* @summary Recoge los posts escritos en el perfil gracias a la ruta del usuario.
	* @locus profile
	* @param {String} profileUser nombre del usuario, con firstname y lastname.
	*/
    stories:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username}, {fields: {_id:1}});
        return profileUser ? Stories.find({createdFor: profileUser._id}, {sort: {createdAt:-1}, limit: 10}) : [];
    }

})
