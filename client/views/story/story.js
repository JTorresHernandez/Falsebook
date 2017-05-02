
Template.story.events({

    'click .like':function(e) {
        e.preventDefault();
        var story = Blaze.getData(e.currentTarget);

        var like = Meteor.user();

        var likeInfo = {name: like.profile.name.first + " " + like.profile.name.last};
        var CheckLike = _.findWhere(story.likes, likeInfo);

        if(!CheckLike){

            Stories.update({_id: story._id}, {$push:{likes: likeInfo}});
        } else {
            Stories.update({_id: story._id}, {$pull:{likes:likeInfo}});
        }
    },

    'click .delete-story':function(e){
      e.preventDefault();
      var story = Blaze.getData(e.currentTarget);

      Stories.remove(story._id);
    },


    'submit .comment-story':function(event){
      event.preventDefault();

      const target = event.target;
      const commentText = target.text.value;

      var story = Blaze.getData(event.currentTarget);

      if (commentText){

        var userOwner = Meteor.user();

        Stories.update({_id: story._id}, {$push:{comments: {
                                                   commentText: commentText,
                                                   commentDate: new Date(),
                                                   owner: Meteor.userId(),
                                                   idStory : story._id,
                                                   userImageComment : userOwner.profile.picture.thumbnail,
                                                   creatorNameComment : userOwner.profile.name.first,
                                                   username : userOwner.profile.login.username


                                                }}});

        Stories.update({_id: story._id},{$push:{comments:{$each:[],$sort: {"commentDate": -1}} }},{'multi':true});

      }
      target.text.value = '';

    }


})


Template.story.helpers({
    status:function(){
        return this.createdFor === this.createdBy;
    },

    ownerStory:function(){
        return this.createdBy === Meteor.userId();
    },


    styleLike:function(){

      var like = Meteor.user();
      var likeInfo = {name: like.profile.name.first + " " + like.profile.name.last};
      var CheckLike = _.findWhere(this.likes, likeInfo);
      if (! CheckLike) {
        return false;
      } else {
        return true;
      }
    },


    datestory:function(date) {
      return moment(date).format('MM-DD-YYYY HH:mm');
    },


    likeCount:function(storyId){
        var story = Stories.findOne({_id: storyId});
        var likes = story.likes;
        if(!likes.length) {
            return "In this momment nobody push boton like.";
        } else if(likes.length <= 3) {
            var string = "";
            switch (likes.length) {
                case 1:
                    return likes[0].name + " like this";
                    break;
                case 2:
                    return likes[0].name + " and " + likes[1].name + " likes this";
                    break;
                case 3:
                    return likes[0].name + ", " + likes[1].name + " and " + likes[2].name + " likes this";
                break;
            }

        } else {
            var correctLength = likes.length - 3;
            var correctOther;
            if(correctLength === 1) {
                correctOther = " other person likes this";
            } else {
                correctOther = " other person likes this";
            }
            return likes[0].name + ", " + likes[1].name + ", " + likes[2].name + " and " + correctLength + correctOther;
        }

    }

})


Template.commentTemplate.events({
  'click .delete-comment':function(e){
    e.preventDefault();
    var comment = Blaze.getData(e.currentTarget);
    Stories.update({_id: comment.idStory}, {$pull: { comments: {
                                                      commentText: comment.commentText ,
                                                      commentDate: comment.commentDate,
                                                      owner: comment.owner,
                                                      idStory: comment.idStory,
                                                      userImageComment: comment.userImageComment,
                                                      creatorNameComment: comment.creatorNameComment,



                                                    }}});
  }
})


Template.commentTemplate.helpers({
  dateRefactor:function(date){

    return moment(date).format('MM-DD-YYYY HH:mm');
  },


  ownerComment:function(){
      return this.owner === Meteor.userId();
  }
})
