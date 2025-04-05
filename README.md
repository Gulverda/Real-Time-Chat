# Real-Time Chat App 🚀💬

Excited to share my latest project – a **Real-Time Chat Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and powered by **Socket.io** for real-time messaging.

## 🌟 Features

- **Sign Up & Log In:** Secure authentication with JWT.
- **Friend Requests:** Send, accept, or reject friend requests.
- **Real-Time Chat:** Private one-on-one messaging with instant delivery, powered by **Socket.io**.
- **Profile Management:** Update your username and password anytime.
- **Responsive UI:** Enjoy a sleek, modern interface, designed with **Tailwind CSS**.

## 💡 Tech Stack
- **MongoDB:** Database for storing user and chat data.
- **Express.js:** Web framework for building the API.
- **React.js:** Frontend library for creating the user interface.
- **Node.js:** Backend runtime environment.
- **Socket.io:** Real-time communication for chat functionality.
- **JWT:** Secure user authentication.
- **Tailwind CSS:** Utility-first CSS framework for styling.

## ⚡ Socket.io Integration

**Socket.io** enables real-time, bidirectional communication between the client and server, allowing messages to be instantly delivered between users without the need to refresh the page. Here's how Socket.io is integrated into this project:

- **Real-Time Messaging:** Whenever a user sends a message, it is immediately transmitted to the recipient without delay, thanks to Socket.io's real-time features.
- **Event-based Communication:** The server emits events when a message is sent or a friend request is accepted/rejected, which are then captured and displayed instantly on the client side.
- **User Presence:** The app tracks user activity in real-time, showing who is online and available for chat.

### Key Socket.io Events:
- **`message`:** Emitted when a user sends a new message, notifying the recipient in real-time.
- **`connect`:** Triggered when a user connects to the chat, allowing the server to track active users.
- **`disconnect`:** Triggered when a user leaves the chat or closes the app.
- **`friendRequest`:** Emitted when a friend request is sent, allowing users to accept or reject it in real-time.

## 🚀 Live Demo & GitHub

- [Live Demo](https://real-time-chat-mu.vercel.app/)
- [GitHub Repository](https://github.com/Gulverda/Real-Time-Chat)

## 🚀 AI-Enhanced Development
During development, I leveraged AI to optimize my code, enhance functionality, and streamline the process of building out the features. This helped me improve efficiency and deliver a high-quality, interactive experience.

Feel free to check out the project, explore the source code, and try the app live! 🎉
