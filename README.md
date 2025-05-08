Voting System Project
Overview
This project is a simple voting system web application where users can vote for candidates in an election. The system includes the following features:

User Authentication: Users can sign up, log in, and cast votes.
Vote Submission: After login, users can vote for candidates, and the votes are stored in a MongoDB database.
Prevention of Multiple Votes: Once a user votes, they cannot vote again.
Election Results: The results are displayed showing candidates and their votes, with a "Congratulations" message for the winner.

Features

Sign Up & Login:
Users can create an account and log in to cast votes.

Voting Page:

Registered users can see a list of candidates and vote.
Vote data is stored in MongoDB.
Each user can vote for one candidate only.

Results Page:

Displays the election results, showing the candidates ordered by the number of votes.
The candidate with the highest number of votes is displayed with a congratulatory message.



Setup Instructions
Prerequisites
Node.js

MongoDB running locally or a MongoDB Atlas cluster

Installation
Clone the repository to your local machine:

npm install
Set up your MongoDB (either locally or on MongoDB Atlas). Make sure to update the MongoDB URI in your server.js file if you're using a custom URI.

Start the server:
node server.js
Navigate to http://localhost:3000 in your browser.


Running the Project

Sign Up: Navigate to the sign-up page and create an account.
Login: Once signed up, log in with your credentials.
Vote: After logging in, visit the voting page, choose a candidate, and submit your vote.
Results: After voting, you will be redirected to the results page, where the election results will be displayed.


Testing the System

Test signing up with different users.
Ensure that once a user votes, they can't vote again.
Check if the results page reflects the correct number of votes for each candidate.


Technologies

Node.js: Used for server-side logic.
Express.js: Web framework for routing.
MongoDB: Database for storing user information and votes.
HTML, CSS, and JavaScript: For the frontend layout and interactivity.
