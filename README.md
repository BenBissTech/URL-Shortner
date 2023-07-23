# URL-Shortner
 Web application to shorten provided URLs
 
 Packages:

 Bootstrap - prewritten CSS framework (stylises webpage)
 React-bootstrap - bootstrap for react
 Nanoid - generates unique identifier which will append to the generated shortened URL
 React-router-dom - handles routen for the webpages of the application
 Firebase - stores the data for the application
 Valid-url - tells us if provided URL by user is valid

To solve Switch import failure
    npm install react-router-dom@5.2.0
or use Routes instead of Switch

npm install --save-dev @babel/plugin-proposal-private-property-in-object
Fix bug

Within Server:
Must create reference to ServiceAccountKey within the folder
Removed from current repository due to security reasons

Steps to test via virtual server:


Obtain private key from firebase server and create new json file - "url-short-server\ServiceAccountKey.json" and store key within

cd into url-short-server folder
Run - python3 -m venv *name of virtual server*
Run - Set-ExecutionPolicy Unrestricted -Scope Process (allows you to activate scripts within current powershell session)
Run - *name of virtual server*\Scripts\activate
Run - pip install -r requirements.txt (install all necessary imports)
Run - python .\wsgi.py
