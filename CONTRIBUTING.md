# Contributing

Git Workflow
------------
We will be using the Git workflow detailed [here](http://nvie.com/posts/a-successful-git-branching-model/).
Never commit to ``master`` and never commit to ``develop``. Instead, create a branch or a fork, work on that, and then submit a pull request. 
Here are the steps to do that:

1. ``git checkout develop`` This will switch you to the develop branch.
2. ``git pull`` This will make sure your develop branch is up to date.
3. ``git checkout -b branch-name`` This will checkout a new branch with the name *branch-name*.
4. Write some code, commit it.
5. ``git push -u origin branch-name`` This will push your branch to Github. You only need to do this once per branch.
6. Submit a pull request
7. If there are changes that need to be made make them
8. ``git push origin branch-name``

Commits
-------
Each commit should reflect a small, isolated change. Avoid having one commit cover an entire feature. 
For example, if the feature you're working on is user registration you might have the following commits:

1. Added HTML for registration page.
2. Styled registration page.
3. Created API for registering new user.
4. Added Angular controller to handle user registration.

Please refrain from garbage commit messages like *jfdkjsfkjsf*. All pull requests
with these will be denied. Instead, use the following template:

    Short message describing the basics of what you did. (<80 characters)
    
    Optional longer description describing any special things you did.
     
Trello Workflow
---------------
We will be using 4 boards:

1. **Backlog:** These are tasks that no one is working on. They may or may not be assigned to anyone yet.
2. **In Progress:** If you start working on a task move it here. This corresponds with making a branch for a task.
3. **Staging:** Once you submit a pull request move the task here.
4. **Done:** After I accept the pull request I will move the task here.

