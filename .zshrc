echo hello mr glueckler

alias asdf="clear && pwd"
alias entries="cd ~/Dropbox/entries"
alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"

# git aliases
alias giiit="git add -A && git commit"
alias gsweep="git reset --hard && git clean -df"
alias gpld="git checkout develop && ggpull"
alias gmd="git merge develop"

# hidden files aliases
alias showfiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
alias hidefiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'

function ~~ () {
    cd /Users/slimbean/Desktop/$1
    ls
}

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/dbean/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
ZSH_THEME="glueckler"

# use case-sensitive completion.
# CASE_SENSITIVE="true"

# use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
HYPHEN_INSENSITIVE="true"

# disable colors in ls.
# DISABLE_LS_COLORS="true"

# display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
DISABLE_UNTRACKED_FILES_DIRTY="true"

# Add wisely, as too many plugins slow down shell startup.
plugins=(
  git
  zsh-autosuggestions
)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"
