// This file contains a centralized list of methods that a client can call
// to execute remote procedure code on the server.
//
// XXX Since we are on the server, this file should probably switch to the
// Fiber/Sync version of HTTP and methods calls. This would be cleaner (no
// callback, less spaghetti code) and would throw fetch error automatically if
// needed (currently the callback is called even if there is a fetch error).
//
// XXX We need a better way to manage errors. Code and messages used are not
// consistent and the same error may be raised in two different formats.
//
// XXX Some of these methods accept a `Match.ObjectIncluding` format as a
// parameter. This is generally not necessary and we should update the client
// so we could be more strict about parameters we accept.
//
// XXX The way we manage environment is not consistent with server/auth.js
//
// XXX Same queries are often done several times at different place in this
// code. That will make editing schemas very difficult, we shouldn't repeat
// ourselves.
//
// XXX Some of these methods (at least vote, unvote, createTopic, and
// createComment) could benefit from latency compensation. There is no good
// reason to define these only on the server.

var environment = Meteor.settings.environment;
var group_urlname = Meteor.settings[environment].meetup.group_urlname;

Meteor.methods({
  MeetupAPI: function(endpoint, param) {
    check(endpoint, String);
    check(param, Object);

    switch (endpoint) {
      case "getEvents":
        return AsyncMeetup.getEvents(param);
      case "getProfiles":
        return AsyncMeetup.getProfiles(param);
      case "getRSVPs":
        return AsyncMeetup.getRSVPs(param);
      case "postRSVP":
        // XXX Does not seem to be working, can't pass access token as headers
        return AsyncMeetup.postRSVP(param);
    }
  },

  // XXX This is probably not a function every client should be allowed to call.
  // We now have the `meteor shell` command so it's very easy during the
  // development phase to call a function defined on the server only without
  // exposing it to all clients via a public method.
  fetchProfiles: function(offset) {
    check(offset, Match.Optional(Number));
    offset = offset || 0;

    var fetchProfilesPerPage = 200;
    var adminRoles = ["Organizer", "Co-Organizer"];

    console.log("Fetching Meetup Member Profiles offset", offset);

    Meteor.call('MeetupAPI', 'getProfiles', {
      offset: offset,
      page: fetchProfilesPerPage,
      group_urlname: group_urlname,
      fields: "other_services"
    }, function(err, response) {
      if (err) {
        console.error("Fetch error");
        return; // Silently ignore fetch errors
      }
      for (var i = 0, l = response.meta.count; i < l; i++) {
        var profile = response.results[i];

        var thumbnailUrl;
        if (profile && profile.photo && profile.photo.photo_link !== "") {
          thumbnailUrl = profile.photo.photo_link;
        } else {
          thumbnailUrl = "/default-avatar.png";
        }

        var socialLinks = [];
        var userId;
        var meetupUid = profile.member_id;
        for (var service in profile.other_services) {
          if (service === "twitter") {
            var username = profile.other_services.twitter.identifier;
            socialLinks.push({
              service: 'twitter',
              url: 'https://twitter.com/' + username
            });
          } else if (service) {
            var url = profile.other_services[service].identifier;
            socialLinks.push({
              service: service,
              url: url
            });
          }
        }

        var existingUser = Meteor.users.findOne({
          'profile.meetupId': meetupUid
        });
        if (existingUser) {

          userId = existingUser._id;
          Meteor.users.update({
            'profile.meetupId': meetupUid
          }, {
            $set: {
              'profile.name': profile.name,
              'profile.bio': profile.bio,
              'profile.meetupProfileUrl': profile.profile_url,
              'profile.socialLinks': socialLinks,
              'profile.thumbnailUrl': thumbnailUrl,
              'profile.answers': profile.answers
            }
          });
        } else {
          userId = Meteor.users.insert({
            profile: {
              meetupId: meetupUid,
              name: profile.name,
              bio: profile.bio,
              meetupProfileUrl: profile.profile_url,
              socialLinks: socialLinks,
              thumbnailUrl: thumbnailUrl,
              answers: profile.answers
            },
            services: {
              meetup: {
                id: meetupUid
              }
            }
          });
        }

        // If the Meetup user is in leadership team, then the JSON response will
        // have a "role" variable returned with values such as "Organizer",
        // "Co-Organizer", etc.
        if (response.results[i].role) {
          if (_(adminRoles).contains(profile.role)) {
            Roles.addUsersToRoles(userId, ['admin']);
          }
        }
      }
      // We have more than one page of profiles, fetch the next one
      if (response.meta.count === fetchProfilesPerPage) {
        Meteor.call("fetchProfiles", offset + 1);
      }
    });
  },

  fetchEvents: function(status) {
    check(status, String);
    console.log("Fetching Meetup Events");
    Meteor.call('MeetupAPI', 'getEvents', {
      group_urlname: group_urlname,
      status: status,
      fields: "featured"
    }, function(err, response) {
      if (err) {
        console.error("Fetch error");
        return; // Silently ignore fetch errors
      }
      for (var i = 0, l = response.meta.count; i < l; i++) {
        var meetupData = response.results[i];
        var existingMeetup = Meetups.findOne({
          meetupId: meetupData.id
        });
         // Mongo doc _id of meetup document. This is not the meetup.com's
         // meetupId
        var meetupDocId;

        var meetup_hash = {
          title: meetupData.name,
          description: meetupData.description,
          meetupId: meetupData.id,
          meetupUrl: meetupData.event_url,
          featured: meetupData.featured,
          dateTime: moment(meetupData.time).toDate()
        };
        if (meetupData.venue) {
          meetup_hash = _.extend(meetup_hash, {
            location: {
              name: meetupData.venue.name,
              address: meetupData.venue.address_1,
              lat: meetupData.venue.lat,
              lon: meetupData.venue.lon,
              description: meetupData.how_to_find_us
            }
          });
        }

        if (existingMeetup) {
          meetupId = existingMeetup._id;
          Meetups.update({
            _id: existingMeetup._id
          }, {
            $set: meetup_hash
          });
        } else {
          meetupId = Meetups.insert(meetup_hash);
        }

        Meteor.call('MeetupAPI', 'getRSVPs', {
          event_id: meetupData.id,
          rsvp: "yes"
        }, function(err, res) {
          for (var j = 0, l = res.meta.count; j < l; j++) {
            var rsvpData = res.results[j];
            var meetupUserId = rsvpData.member.member_id;
            var user = Meteor.users.findOne({
              'profile.meetupId': meetupUserId
            });
            if (user) {
              var meetup = Meetups.findOne({
                _id: meetupDocId
              });
              if (!Activities.findOne({
                userId: user._id,
                subjectId: meetupDocId,
                type: 'rsvp'
              })) {
                Meetups.update({
                  _id: meetupDocId
                }, {
                  $addToSet: {
                    'attendeeIds': user._id
                  }
                });
                Activities.insert({
                  userId: user._id,
                  subjectId: meetupDocId,
                  subjectTitle: meetupData.name,
                  subjectType: 'meetup',
                  type: 'rsvp'
                });
              }
            }
          }
        });
      }
    });
  },

  doRSVP: function(eventId) {
    check(eventId, String);

    var user = Meteor.user();
    if (!user)
      throw new Meteor.Error(403, {
        status: 'error',
        code: 'not-logged-in',
        errorTitle: 'Not logged in',
        errorDesc: 'You are not logged in to RSVP.'
      });

    // If user is not a member, let the client redirect the user to join page ?
    if (!user.profile.meetupId) {
      throw new Meteor.Error(403, {
        status: 'error',
        code: 'not-a-member',
        errorTitle: 'Not a Member',
        errorDesc: 'You are not a member of this group.'
      });
    }
    var meetupUserId = user.profile.meetupId;
    // Ref: http://www.meetup.com/meetup_api/auth/
    HTTP.post("https://api.meetup.com/2/rsvp/", {
      params: {
        event_id: eventId,
        rsvp: 'yes',
        key: api_key
      },
      headers: {
        "Accept": "*/*",
        "User-Agent": "Meetup API lib for Node.js 0.1.3",
        "Authorization": "bearer " + user.services.meetup.accessToken
      }
    },
    function(err, res) {
      if (err) {
        throw new Meteor.Error(403, {
          status: 'error',
          code: 'unknown-error',
          errorTitle: 'Unknown Error',
          errorDesc: 'There was an error processing this RSVP.'
        });
      }

      var meetup = Meetups.findOne({
        meetupId: eventId
      });
      var rsvpData = res.data;

      // Potential responses: "yes", "no", "waitlist" or "yes_pending_payment"
      if (rsvpData.response === 'yes') {
        if (!Activities.findOne({
          userId: user._id,
          subjectId: meetup._id,
          type: 'rsvp'
        })) {
          Meetups.update({
            meetupId: eventId
          }, {
            $addToSet: {
              'attendeeIds': user._id
            }
          });
          Activities.insert({
            userId: user._id,
            subjectId: meetup._id,
            subjectTitle: rsvpData.event.name,
            subjectType: 'meetup',
            type: 'rsvp'
          });
        }
      }
    });
  },

  createTopic: function(params) {
    check(params, {
      _id: String,
      title: String,
      description: String
    });

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    Topics.insert({
      _id: params._id,
      title: params.title,
      description: params.description,
      userId: Meteor.userId(),
      points: 0
    });
  },

  createComment: function(params) {
    check(params, {
      body: String,
      parentType: String,
      parentId: String,
      parentTitle: String
    });

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    Comments.insert({
      body: params.body,
      parentType: params.parentType,
      parentId: params.parentId,
      userId: Meteor.userId()
    });

    var collection;
    if (params.parentType === 'topic') {
      collection = Topics;
    } else if (params.parentType === 'presentation') {
      collection = Presentations;
    } else {
      throw new Meteor.Error("Invalid parent type");
    }

    collection.update({
      _id: params.parentId
    }, {
      $inc: {
        numberOfComments: 1
      }
    });

    var activityType = 'commented_on_' + params.parentType;
    Activities.insert({
      userId: Meteor.userId(),
      subjectId: params.parentId,
      subjectType: params.parentType,
      subjectTitle: params.parentTitle,
      type: activityType
    });
  },

  voteOnTopic: function(topicId) {
    check(topicId, String);

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    var topic = Topics.findOne(topicId);

    if (!topic)
      throw new Meteor.Error("Topic not found");

    if (topic.presented)
      throw new Meteor.Error("topic-presented");

    Topics.update(topicId, {
      $inc: {
        points: 1
      }
    });

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $addToSet: {
        'profile.votedTopicIds': topic._id
      }
    });

    Activities.insert({
      userId: Meteor.userId(),
      subjectId: topic._id,
      subjectTitle: topic.title,
      subjectType: 'topic',
      type: 'voted_on_topic'
    });
  },

  unVoteOnTopic: function(topicId) {
    check(topicId, String);

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    Topics.update(topicId, {
      $inc: {
        points: -1
      }
    });

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $pull: {
        'profile.votedTopicIds': topicId
      }
    });

    Activities.remove({
      userId: Meteor.userId(),
      subjectId: topicId,
      subjectType: 'topic',
      type: 'voted_on_topic'
    });
  },

  likePresentation: function(presentation) {
    check(presentation, Match.ObjectIncluding({
      _id: String,
      title: String
    }));

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $addToSet: {
        'profile.likedItemIds': presentation._id
      }
    });

    Activities.insert({
      userId: Meteor.userId(),
      subjectId: presentation._id,
      subjectTitle: presentation.title,
      subjectType: 'presentation',
      type: 'liked_presentation'
    });
  },

  rsvp: function(params) {
    check(params, Match.ObjectIncluding({
      meetupDocId: String
    }));

    if (!Meteor.userId())
      throw new Meteor.Error("logged-out");

    Meetups.update({
      _id: params.meetupDocId
    }, {
      $addToSet: {
        'attendeeIds': Meteor.userId()
      }
    });

    var meetup = Meetups.findOne(params.meetupDocId);
    Activities.insert({
      userId: Meteor.userId(),
      subjectId: meetup._id,
      subjectTitle: meetup.title,
      subjectType: 'meetup',
      type: 'rsvp'
    });
  },

  custom: function(params) {
    check(params, Match.ObjectIncluding({
      userId: String,
      reason: String,
      points: Number
    }));

    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Activities.insert({
        userId: params.userId,
        subjectTitle: params.reason,
        points: params.points,
        type: 'custom'
      });
    }
  },

  addTopicToMeetup: function(params) {
    check(params, Match.ObjectIncluding({
      meetupId: String,
      topicId: String,
      presenterId: String,
      customTitle: String,
      customDescription: String
    }));

    if (! Meteor.userId() || ! Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      throw new Meteor.Error('not-authorized');
    }

    if (params.topicId) {
      Topics.update({
        _id: params.topicId
      }, {
        $set: {
          meetupId: params.meetupId,
          presented: true,
          presenterId: params.presenterId
        }
      });
    } else {
      Topics.insert({
        title: params.customTitle,
        description: params.customDescription,
        meetupId: params.meetupId,
        presented: true,
        presenterId: params.presenterId,
        userId: Meteor.userId(),
        points: 0
      });
    }

    var title = "";
    if (params.topicId) {
      var topic = Topics.findOne(params.topicId);
      title = topic.title;
    } else {
      title = params.customTitle;
    }
    Activities.insert({
      userId: params.presenterId,
      subjectId: params.topicId,
      subjectTitle: title,
      subjectType: 'topic',
      type: 'presented_topic'
    });
  },

  useCoupon: function(couponCode) {
    check(couponCode, String);

    var coupon = Meteor.settings.coupons[couponCode];
    if (!Meteor.userId()) {
      throw new Meteor.Error('not_logged', 'You must log in');
    }
    if (!coupon) {
      throw new Meteor.Error('coupon_unknown', 'Coupon not found');
    }
    if (!coupon.state) {
      throw new Meteor.Error('coupon_disabled', 'Coupon disabled');
    }
    if (_.contains(Meteor.user().profile.coupons, couponCode)) {
      throw new Meteor.Error('coupon_already_used',
                                           'You have already used this coupon');
    }

    Activities.insert({
      userId: Meteor.userId(),
      subjectId: couponCode,
      subjectTitle: coupon.title,
      subjectType: 'coupon',
      type: 'custom',
      points: coupon.points
    });

    Meteor.users.update(Meteor.userId(), {
      $addToSet: {
        'profile.coupons': couponCode
      }
    });
  }
});
