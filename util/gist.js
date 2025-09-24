// util/gist.js

const Chat = require("../models/Chat");
const { Server } = require("socket.io");

let users = {}; // { socketId: { username, chat } }

function initChat(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // TODO: Restrict later to frontend domain
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    // --- Handle joining a chat room ---
    socket.on("joinChat", (payload) => {
      const username = String(payload?.username || "").trim();
      const chat = String(payload?.chat || "").trim();
      if (!username || !chat) {
        console.warn("⚠️ joinChat payload invalid:", payload);
        return;
      }

      users[socket.id] = { username, chat };
      socket.join(chat);

      // Notify others
      socket.broadcast.to(chat).emit("chat message", {
        user: "System",
        text: `${username} joined ${chat} room`,
      });

      updateChatUsers(chat);
      emitTotalUsers();
    });

    // --- Handle chat messages ---
    socket.on("chat message", async (msg) => {
      const user = users[socket.id];
      const username = user?.username || msg.user || "Anonymous";
      const chat = user?.chat || msg.chat || "general";

     //console.log("📩 Incoming message:", msg, "➡️ Final:", { username, chat });

      try {
        const newMsg = await Chat.create({
          user: username,
          text: msg?.text || "",
          file: msg?.file || null,
          chat: chat,
        });

        //console.log("💾 Saved to DB:", newMsg);
        io.to(chat).emit("chat message", newMsg);
      } catch (err) {
        console.error("❌ DB save failed:", err);
      }
    });

    // --- Typing events ---
    socket.on("typing", () => {
      const user = users[socket.id];
      if (user) {
        socket.broadcast.to(user.chat).emit("typing", user.username);
      }
    });

    socket.on("stop typing", () => {
      const user = users[socket.id];
      if (user) {
        socket.broadcast.to(user.chat).emit("stop typing", user.username);
      }
    });

    // --- Disconnect ---
    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        const { username, chat } = user;
        delete users[socket.id];

        io.to(chat).emit("chat message", {
          user: "System",
          text: `${username} left ${chat} room`,
        });

        updateChatUsers(chat);
        emitTotalUsers();
      }
    });

    // --- Helpers ---
    function updateChatUsers(chat) {
      const usersInChat = Object.values(users)
        .filter((u) => u.chat === chat)
        .map((u) => u.username);

      io.to(chat).emit("chat users", {
        users: usersInChat,
        count: usersInChat.length,
      });
    }

    function emitTotalUsers() {
      io.emit("total users", Object.keys(users).length);
    }
  });
}

module.exports = initChat;
