# git reset
`git reset` is a surprisingly powerful command.

## Remove files from a commit
If you mistakenly did `git add` for some files (and they were added to the index), and don't wish to commit them, git reset will help you:
```
git reset .
```

## Undo (revert) local changes
If you have a few local changes that need to be deleted, `git reset` to the rescue (with a bit of help from `git clean`.
```
# resets all tracked files
git reset --hard

# deletes all untracked files
git clean -fd
```

## Undo last (n) commit(s)
You can go further and apply the same principles not just to uncommitted changes, but you can 

```
git reset --soft HEAD~1
```

You can also specify more than `~1` commit, or a specific commit hash, to reset more than one commit at the time.

## Delete (n) commit(s)
And with the `--hard` switch, you can completely delete one or multiple commits:
```
git reset --hard HEAD~1
```

