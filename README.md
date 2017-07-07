This project is using scss.

And the ruby gem provided by sass is being used to transpile SCSS to css

to install that gem use:
> gem install sass

to convert one SCSS file to CSS file
> sass input.css output.css

to watch changes in a folder and output to a new folder
> sass --watch input/folder:output/folder
this project is USING:
> sass --watch public/scss:public/stylesheets
NOTE: This process has to keep running in the terminal, needs it's own terminal window
(running with & doesn't push it to background, it still keeps logging into terminal window)


# About data
The data is stored in MongoDB hosted on a different server
The settings are defined in environment variables of server hosting this app.
