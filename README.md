Meteor Vegas Website
=======

Meetup Manager

# Feature Development

1. Create a branch

  ```
  git co -b name-of-feature
  ```

2. Develop and test feature

3. Make sure you have latest master

  ```
  git fetch
  git merge origin/master
  ```

4. Merge feature branch into `master`

  ```
  git co master
  git merge name-of-feature
  ```
5. Push to Github

  ```
  git push origin/master
  ```

# Deployment

TODO:
`meteor deploy vegas.meteor.com`
