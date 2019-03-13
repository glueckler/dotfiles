echo hello mr glueckler

alias asdf="clear && pwd"
alias entries="cd ~/Dropbox/entries"
alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"

# git aliases
alias giiit="git add -A && git commit"
alias gsweep="git reset --hard && git clean -df"
alias gpld="git checkout develop && ggpull"
alias gmd="git merge develop"

# makeshift alias from nathan
alias brails="bundle exec rails"
alias brake="bundle exec rake"
alias bspec="bundle exec rspec"
# for dropping database and recreating and reseeding
alias dbreset="bundle exec rake db:drop && bundle exec rake db:create && bundle exec rake db:migrate && bundle exec rake db:seed &"
# something to do with ports
export MAKESHIFTPATH=$HOME/asdf/makeshift-web
alias makeshift_id="cd $MAKESHIFTPATH/makeshift-id && bundle exec rails s -p 3020"
alias makeshift_hr="cd $MAKESHIFTPATH/makeshift-hr && bundle exec rails s -p 3010"
alias makeshift_ew="cd $MAKESHIFTPATH/makeshift-employee-web && bundle exec middleman server"

# hidden files aliases
alias showfiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
alias hidefiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'

function ~~ () {
    cd /Users/$(whoami)/Desktop/$1
    ls
}

# ----- ----- ----- ----- -----

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/$(whoami)/.oh-my-zsh"

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

# ----- ----- ----- ----- ----- ----- 

# Machine specific config

# run rbenv at startup
eval "$(rbenv init -)"

# add libpq to path for psql
export PATH="/usr/local/opt/libpq/bin:$PATH"


