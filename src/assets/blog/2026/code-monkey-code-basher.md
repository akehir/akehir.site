
Working in Information Technology right now means that there is no way to avoid the topic of AI / LLM. Personally, I have been thinking about machine learning for a long time, and from before it was `cool`. For instance, I have an (unpublished, how typical) blog post about a [paper](https://arxiv.org/abs/1312.6199) of Ilya Sutskever *et al.* from 7 years ago.

That is a lot of words to say that I have thoughts about machine learning, and I am now opting to opine them even in their raw form.

One observation about the job of a software engineer who uses a lot of AI in his/her work, is that the job is shifting from code monkey to code reviewer. Of course, this is not a new development, with stack overflow and other resources, a big part of the job has in recent time always been researching and integrating preexisting code (or design / architecture patterns) into the current project.

But not to the degree as with `agentic development`. Here, you give the agent a task, and it spits out a solution for the developer to accept and **review**.

A second observation to note is that I am *severely* lacking as a code reviewer (not that I would not be lacking as a coder). A code review requires a lot of focus and thinking to evaluate a given solution to a problem critically and to find shortcomings / improvements to the solution. Often it is only through the experience of having implemented similar programs or faced similar problems that one can accurately judge a piece of code.

In any case, it is a very different skill set from writing code. One that needs to be practiced. And it is exhausting. It is no problem to code 8 hours straight (or 12 or more) for me (and others I know). But code reviews are another beast: the need to focus, and the degree of abstraction is on another dimension, and it is not something I am seriously capable of doing for any length of time.

This is the reason people say the software engineer role is moving from a coding focus to more of an senior / architect type of role. Seniors are coaching juniors through pair programming and code reviews. Software architects design solutions with established patterns in order to create scalable and maintainable products.

But we should not forget that neither seniors nor architects are falling out of the sky. They got to their position through experience.

Maybe it is an issue of tooling. Maybe the code review process can be simplified and improved. But even with the best tooling, a core problem remains:

The problem is, without writing code and debugging hairy issues, you do not develop an intuition for grokking code as you read it. You do not recognize edge cases that were missed. You do not understand where technical debt is produced, as it is not a conscious decision you made when creating your solution to the current challenge within the context of the code basis and team you have. You do not see the trade-offs, because you do not wrestle with the tough issues - you just receive a solution. On a silver platter, ready to digest.

In my role, I do a lot of code reviews, and I talk to many architects. For me, it is quite plain to see that if one does not get into the trenches and writes a little bit of code, the skill of reviewing code suffers just as much as the skill of writing code atrophies.

In order to deal with this, the right tooling will be mandatory. Automated tests, formal verification systems (like compilers, or static code analysis), linting and styling rules, a strong code revision history will be key. Basically, good software engineering principles.

But I remain worried that we do not find a suitable solution for the core problem. The problem that without experience and exposure, you are a bad judge of code. You cannot bash it where it hurts. And that will hurt the quality of your software.

