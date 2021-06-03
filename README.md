# Loqulii

Loqulii is a social media platform that will allow users the ability to connect directly with with the social media posts and upcoming events in their local area. Inspration for this app centers around encouraging and easing integration back into our communities as Covid restrictions begin to ease.


## update

Current version supports:
-  user registration and login
-  making/deleting posts, replying to posts, liking and retweeting other users posts 
-  profile page customization with working image cropping and upload for cover Photo and profile pic photo (TODO: media posts infrastructure: video)
-  search functionality for both users and posts. user search will filter for both username, and first and last name.
-  search functionality for both users and posts. user search will filter for both username, and first and last name.
-  User Chat functionality is available for both group chats and 1-on-1 chats. chat Name can be changed and updates for all users. 

TODO:

- (current task): create effective framework for real-time chat interactions using socket.io. fix styling for chat display. create condition to only load a certain number of chat messages, and then initialize new requests to retrieve older chats when users scroll further back

- (next task): create effective notifications page that runs in real-time

- (after): begin utilizing TikTok Api, Twitter Api, and facebook api, to retrieve the most popular posts by location metadata. (include (seen) attributes to all retrieved posts schema so that users do not receive repetitive information.


As of current build, the infrastructure to only have posts visible of the users that the currently logged-in user follows is available, but is intentionally set to false for the sake of development and presentation. to Test, set second object of the get request in home.js to true.
## Installation


```bash
npm install
```
Live version available at loqulii.herokuapp.com

## Usage



## Contributing
Pull requests are more than welcome. For major changes, please open an issue first to discuss what you would like to change, or discuss issues with the current build.
