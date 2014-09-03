# TODO

## Auth
- Get additional profile data from Meetup oauth
  - avatar
  - bio
  - email address
  - social links (facebook, twitter, github)
- Find a way to store Meetup api/oauth tokens in the codebase?

# Meetups
  - Push or pull meetups to/from Meetup.com?
  - A member should be able to RSVP for a meetup
  - An admin should be able to create a meetup
    - Name, description, location details, add topics/speakers

# Topics
  - A member should be able to suggest a topic
  - A member should be able to vote on a topic
  - A member should be able to comment on a topic
  - The topics list should be sorted by most points first
  - Comments should be sorted newest first
  - An admin can delete questionable topics
  - An admin should be able to flag a topic as "presented"
  - An admin can assign a topic to a meetup (which awards points to the presenter)

# Members
  - A member's activity should be tracked and awarded points
  - The members list should be sorted by most points first

# Presentations
  - A member should be able to add a presentation
    - title, description, embed code (slideshare, youtube, etc)
  - A member should be able to like a presentation
  - A member should be able to comment on a presentation
  - Presentations should be sorted newest first
  - Comments should be sorted newest first
  - An admin can delete questionable presentations

---------

# Internal
  Create a [meteor.com org](https://meteor.hackpad.com/Meteor-developer-accounts-organizations-bqdepZkDB3w), add everyone as collaborators
  Create a @MeteorVegas Twitter account

# Config
  - Allow forkers to change various site attributes from a single config file
    - meetup title, meetup description, meetup ID, Twitter handle, Github handle, etc

# i18n
  - Since the goal is for our app to be used globally by meetup groups, we should consider adding i18n functionality

# Design
  - Need visual design / theme
