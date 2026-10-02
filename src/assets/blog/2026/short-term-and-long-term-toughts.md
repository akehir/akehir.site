# Short Term and Long Term Toughts on AI and LLMs

_Published: 2026-10-02_

I wanted to pen some more thoughts about LLM usage, especially in coding.

Today, I wanted to think (and write) about one major problem area I see. I am specifically excluding ethical issues, and copyright issues, as these are separate topics warranting their own space. I am also not talking about the economics.

Especially over the course of the first half of 2026, it has become clear that LLMs do in fact have a place in coding, and that they enable productivity gains.

However, many of these gains are mainly short-term gains, and I envision problems that arise specifically when LLMs are used long-term. I have not seen these problems discussed as much as the obvious issues (ethical, economic, copyright), and the short-term benefits of LLM-assisted coding.

From a practical perspective, I believe, LLMs are here to stay in some way or another (since they have proven their usefulness; since there are open source models available that anyone can host for themselves - as I do). Therefore I think it is important to address these longer-term issues.

The issues are:

- less senior programmes, because the path to becoming a senior is more difficult
- reviewing code is not the same as writing code (and less fun)
- less documentation to learn from (stackoverflow, wikipedia are in peril)
- it becomes more difficult to maintain and understand software
- training on synthetically generated data stifles innvoation

I will get into each of the issues in detail later. As a preamble, I wanted to mention that these are not new processes. For instance, we have been creating computer programs on higher levels of abstraction already. From assembly to c to python, the higher the levels of abstraction, the less a programmer in these languages needs to understand the underlying system. One could argue, that LLM generated code is just another layer of abstraction, especially if a functioning program is the only artefact we care about.

However, while each level of abstraction enables a higher productivity because the developer does not need to be concerned with things that are beneath the abstraction, this increased productivity comes at a cost of deeper understanding of the system. A frontend developer writing JavaScript does not need to think about memory management, for instance. The flip side of this is, that it is not possible to be very memory efficient in JavaScript. Usually, it is a trade-off that one could be willing to make; however since LLMs use `natural` language input so far removed from programming languages, there is almost no reasoning about the deeper state of the computer anymore.

This brings me to the first point on my bullet list. The path to become a senior becomes much more difficult, since in creating a program, instead of reasoning about the goal of the task and how the system must be evolved to meet that goal, you just throw a prompt at a slot machine / slop machine, and get a result. I think becoming a senior involves wrestling with unknown errors, foguring out how the system works beneath them and finding a solution. It also involves designing yourself into a corner and writing some spaghetti code. All of these experiences accummulate and one becomes senior along the way. If an error just means pushing the buttons to generate a solution, I believe the path to seniority becomes more difficult.

In an ideal world, you can read and review the LLM generated code and come to similar understanding about the code as if you had written it yourself. I say in an ideal world, because understanding code written by someone else is more difficult than writing that code in the first place. And even just having written the code does not imply that the programmer has actually understood what was just written. In any case, understanding code takes a lot of mental focus, because it is a very abstract process. Basically one has to simulate all possible states of the program and evaluate how it would behave under these conditions. In the mind.

So while we have writing code on one hand, which is the process of formulating a specific behaviour that the computer will always follow - it is inherently a creative process. Reviewing code is the opposite, it is figuring out what the behaviour of the computer would be when it executes a program: it is inherently an abstract process. Now, programming has an element of abstraction to it as well, as we have established, modern computer languages are highly abstracted. But I speak from my own experience, I can easily enter the flow and program for any number of hours; and reviewing any non-trivial piece of code is much more tolling. Even staying focused for an 1 hour code review is difficult.
