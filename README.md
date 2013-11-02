Architect
=========

Architect is a web-based avionics system design tool.

## Motivation

todo

## Setup

This setup sequence has been tested on Ubuntu 12.04. If you'd like, you can set up a virtual environment. Otherwise, skip those steps.

    sudo apt-get install python-pip
    #pip install virtualenv
    #virtualenv djangoenv
    #source djangoenv/bin/activate
    pip install Django==1.5

Next, clone the project and initialize the database.

    cd ~/
    git clone https://github.com/joshvillbrandt/Architect.git
    cd Architect
    python manage.py syncdb

If you would like, you can preload some data.

    todo

Finally, you can run the server.

    python manage.py runserver 0.0.0.0:8001

