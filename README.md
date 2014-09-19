Meteor Vegas Website
=======

This is the website for the [Meteor Vegas](http://vegas.meteor.com) Meetup group. It is still under development, but once it is completed we hope that other Meetup groups will be able to fork it and utlize it for themselves.

<a href="http://cl.ly/image/0Y1B0G0l3Z02">
  <img src="http://f.cl.ly/items/2v2v10442O2t0S0z2u2U/meteor-vegas-screenshot.png" width=320 />
</a>

# Feature Development

1. Create a new branch

  ```
  git checkout -b name-of-feature
  ```

2. Develop and test your feature

  ![](http://www.millsworks.net/blog/wp-content/uploads/2009/04/writing_process.gif)

3. Make sure you have the latest `master` branch

  ```
  git fetch
  git merge origin/master
  ```

4. Merge your feature branch into the `master` branch

  ```
  git checkout master
  git merge name-of-feature
  ```

5. Push your new code to Github

  ```
  git push origin/master
  ```

# Deployment

If you are a member of our [Meteor Organization](https://www.meteor.com/blog/2014/09/04/meteor-091-organizations-blaze-APIs), you can deploy the app with a single command:

`meteor deploy vegas.meteor.com`
