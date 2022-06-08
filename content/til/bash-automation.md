---
title: "TIL: Bash Script Automation"
date: 2022-06-07T08:03:37+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, bash, cmd, resource]
tldr: I made a bash script that automates the running of a script, including automatic user input.
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Bash%20Script%20Automation']
---

# [Shebang](https://en.wikipedia.org/wiki/Shebang_(Unix))
First thing I learnt, is that you have to specify the interpreter you want to execute the file.

## Shebang examples
- Execute using Bourne Shell: `#!/bin/sh`
- Execute using Bash Shell: `#!/bin/bash`

## Installing & using `Expect`
> Expect is a scripting language that allows for automation of interactive programs. [src](https://superuser.com/questions/488713/what-is-the-meaning-of-spawn-linux-shell-commands-centos6)

To install it, `sudo apt get expect`. Then make a new file and open it, you can name that file `testscript.sh`

In that script, specify that we're using the `expect interpreter` like so

```bash
#!/usr/bin/expect
```

# `Spawn`, `Expect`, `Send`
The script I was running manually had a sequence like this:
1. Start the script
2. Get prompted for input #1, I type in my input, & press return
3. Get prompted for input #2, I type in my input, & press return
4. Long running script executes in the background

- Spawn is what will take care of step 1
- My best guess at the role of expect, is it let's the interpreter know what string is going to stop execution and prompt for user input. 
- Send is what takes care of the automatic user input

this is how my 4 steps can be automated then 

```bash
#!/usr/bin/expect

set timeout -1
spawn sudo scriptThatIHaveToStart
expect "Input #1"
send "Hey, this is the first input\r"
expect "Input #2"
send "this is the 2nd input\r"

expect eof
```

- `set timeout -1` Will make the process run forever, meaning you have to manually stop the process. This is important is your process is a long running script that you just want in the background.
- That last line is `expect end of file`. I'm not yet sure what that's for, hehe


# Running the script
## chmod to make it executable
Run `chmod +x testscript.sh`. replace testscript with whatever you named yours

## Execution time baby
Then while you're in the directory with the script, `./testscript.sh` will execute it. 

Fin.

# Some resources I used
- [Automate Inputs to Linux Scripts With the expect Command](https://www.howtogeek.com/devops/automate-inputs-to-linux-scripts-with-the-expect-command/)
- [What is the meaning of "spawn" linux shell commands ?](https://superuser.com/questions/488713/what-is-the-meaning-of-spawn-linux-shell-commands-centos6)
- [Expect man page](https://man7.org/linux/man-pages/man1/expect.1.html) - barely read this tbh. The sheer volume of words made me nope tf out of there after getting distracted by the monospace font I liked, haha.

### An error & it's fix
> Expect Script - bash script file not found


If you get this error, it's likely because you haven't installed `expect`. I experienced this, lol.

It's either uninstalled, or you'd have supplied the wrong file path to the expect binary.