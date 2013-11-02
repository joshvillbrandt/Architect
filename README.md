Architect
=========

Architect is a web-based avionics system design tool.

## Overview

This tool was designed out of the need for a simple yet powerful design tool for large electronic systems.

Architect is built around the idea of a part. Parts have channels (which inherit properties from channel types) and each channel has one or more signals. Connectors are the external interfaces for channels. Individual contacts on a connector are assigned to one (or more...) channel signal. Completing this information for one part produces a complete definition of all of the possible input and outputs of a part. This information is what is classically stored in an Interface Control Document or ICD.

## Setup

This setup sequence has been tested on Ubuntu 12.04. If you'd like, you can set up a virtual environment. Otherwise, skip those steps.

    sudo apt-get install python-pip
    #pip install virtualenv
    #virtualenv djangoenv
    #source djangoenv/bin/activate
    pip install Django==1.5

Next, clone the project and initialize the database. The database is automatically populated with an admin user called "user" with password "password".

    cd ~/
    git clone https://github.com/joshvillbrandt/Architect.git
    cd Architect
    python manage.py syncdb --noinput

If you would like, you can preload some data.

    python manage.py loaddata SuperDracoController.json

Finally, you can run the server.

    python manage.py runserver 0.0.0.0:8001

## Detailed Notes

connectors can be connector to other connectors based on rules, specifically, connectors must have the same series, the same she, blah blah blah

acceptable channel mates are explicitely defined, there are no implied acceptable channel mates based on the definition of a channel alone
