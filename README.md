# Meteor Meetup Website

This is a Meteor App that can be used to organize, manage, and market your Meetup group. It was built by the [Meteor Vegas Meetup Group](http://vegas.meteor.com).

* [Features Overview](#features-overview)
* [How To Install](#how-to-install)
* [How To Customize](#how-to-customize)
* [How To Deploy](#how-to-deploy)
* [How To Contribute](#how-to-contribute)

## <a name="features-overview"></a> Features Overview

### Meetup.com Integration

* One-click sign in with Meetup.com OAuth integration
* Pulls new meetup events from Meetup.com every 30 minutes
* Displays members who have RSVP'd on Meetup.com
* Allows members to RSVP to meetups directly from your site

### Meetups
Create your meetup on Meetup.com as usual, and the event will be added to your site within 30 minutes (or manually via the button on the `/meetups` page). Once it is on your site, you can add topics and presenters, and even feature it on your homepage.

### Topics
The topics page allows your members to suggest topics that they would like to hear about in upcoming meetups. Other members can vote on and discuss the topics, allowing the organizers to easily choose which topics should be presented next.

### Presentations
The presentations page gives you a centralized location to store all of your group's presentations. Members can upload their presentations to YouTube, SlideShare, etc, and simply paste a link into the "Add Presentation" form.

### Member Activity
Members are granted activity points when performing certain activities. These points are displayed on their profile, and the member list is sorted by those with the most points.

* Liked a Presentation: 5 points
* Commented on a Presentation: 5 points
* Voted on a Topic: 5 points
* Commented on a Topic: 5 points
* Suggested a Topic: 10 points
* Added a Presentation: 10 points
* RSVP'd to a Meetup: 10 points
* Presented a Topic at a Meetup: 50 points

## <a name="how-to-install"></a> How To Install

1. Clone the repo `git clone git@github.com:meteor-vegas/website.git`
2. Copy the contents of `settings.example.json` into a new `settings.json` file
3. Go to [Meetup OAuth Consumers](https://secure.meetup.com/meetup_api/oauth_consumers/) and create 2 new apps, one for development and one for production
4. Enter the respective keys and secrets into the the `meetup.oauth_key` and `meetup.oauth_secret` keys in `settings.json`
5. Go to [Meetup API Keys](https://secure.meetup.com/meetup_api/key/) and copy your API Key into the `meetup.api_key` keys in `settings.json`
6. Run the app `meteor --settings settings.json`

## <a name="how-to-customize"></a> How To Customize

### Basic Info

Your group's name, description, Meetup URL, Twitter and Github links and even sponsors can all be customized via the `settings.json` file.

### Design / Branding

This app uses Less and Bootstrap for easy customization. Simply change or add Less variables in `client/stylesheets/variables.import.less` to change your brand colors or modify the theme.

Additionally, we make use of [CSS blend modes](http://css-tricks.com/basics-css-blend-modes/) to dynamically change the color of background images based on your `$brand-primary` color. As an example:

![](http://cl.ly/Y6jn/vegas.png =200x102)
![](http://cl.ly/Y6d1/london.png =200x102)
![](http://cl.ly/Y6j5/cincy.png =200x102)

## <a name="how-to-deploy"></a> How To Deploy

1. `meteor create <your-city>`
2. `meteor deploy <your-city>.meteor.com --settings settings.json`
3. Open `<your-city>.meteor.com` in your browser

## <a name="how-to-contribute"></a> How To Contribute

1. [Fork the rep](https://help.github.com/articles/fork-a-repo/)
2. [Submit a Pull Request](https://help.github.com/articles/using-pull-requests/)
