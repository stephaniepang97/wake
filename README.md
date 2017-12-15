# Wake
Wake is a social alarm clock that allows you to set alarms and ask your friends to make sure you wake up to them. Wake is built on Node.js and Express. 

## Authentication and Authorization
Wake supports authentication by allowing new users to register for an account and existing users to login. You must be logged in to view any of the pages other than the login page.   
Authentication and authorization are supported by passport and express-sessions. 

## MongoDB
Wake stores user data onto mLab, which is a free Database-as-a-Service for MongoDB. When the user logs in, they are taken to Spotify's authorization page to login. Then, the user's Spotify data, access token and refresh token are stored into the MongoDB database as well. When a user adds alarms, these alarms get stored to MongoDB as well.

## API
Wake uses the Spotify API to grab user data, search for songs and send songs to other users. Unfortunately, the sending songs functionality only works for Spotify Premium users.
