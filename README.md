# Quiz Game

## Introduction

A quiz game hosted on a web application that retrieves questions from the OpenAI API. The user can request questions on any topic and receives a score out of ten.

## Server

You first need to ensure that the server is running because this is where the API calls will be made to the OpenAI API. If needed install node.js at https://nodejs.org/en/download/package-manager. Then follow the below instructions to run the server:

```
cd server

npm install

npm start
```

## Client

You may be able to run the client by simply opening the `index.html` file with a browser. However, it may be better to run the client code using a local web server, which you can do by executing the below instructions in the terminal:

```
cd client

npm install

npm run start-server
```

The client server should be run on `http://127.0.0.1:8080` by default, but if not the URL should be indicated in the `Available on` section.
