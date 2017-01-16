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


# ABOUT DATA
The data is stored in data folder as blog-data and portfolio-data.
This project is using very simple DB that works based on .json files only.
These are git ignored.
REMEMBER: if you create any new datafile, you need to git ignore it.


# ABOUT DEPLOYMENT
Deploy using bitnami

AWS wants files to be readable by only one user (you) and have only read permission
> chmod 700 .privatekeys/

Now I connect using
> ssh -i ~/.privatekeys/bitnami-my-website.pem bitnami@52.14.51.154
