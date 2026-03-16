// In-memory data store with fixture data and CRUD helpers
// All _id fields are plain strings. Populate functions return copies to avoid mutation.

let nextId = 100;
function genId() { return String(nextId++); }
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

const now = Date.now();
const DAY = 86400000;

// ── Users ──────────────────────────────────────────────
const users = [
  {
    _id: "u1",
    firstName: "Test", lastName: "User", username: "testUser",
    email: "test@gamergab.com", password: "Vigeto22!",
    profilePic: "/images/profilePic.png", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p3", "p5"], retweets: ["p14"],
    following: ["u2", "u3", "u4"], followers: ["u2", "u5", "u6"],
    createdAt: new Date(now - 30 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
  },
  {
    _id: "u2",
    firstName: "Gamer", lastName: "Gal", username: "gamerGal99",
    email: "gamer@gamergab.com", password: "pass123",
    profilePic: "https://i.pravatar.cc/150?u=gamerGal99", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p1", "p4"], retweets: [],
    following: ["u1", "u3"], followers: ["u1", "u3"],
    createdAt: new Date(now - 28 * DAY).toISOString(),
    updatedAt: new Date(now - 2 * DAY).toISOString(),
  },
  {
    _id: "u3",
    firstName: "Pixel", lastName: "Knight", username: "pixelKnight",
    email: "pixel@gamergab.com", password: "pass123",
    profilePic: "https://i.pravatar.cc/150?u=pixelKnight", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p1", "p2"], retweets: ["p15"],
    following: ["u1", "u2", "u4"], followers: ["u1", "u2", "u4"],
    createdAt: new Date(now - 25 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
  },
  {
    _id: "u4",
    firstName: "Neon", lastName: "Ninja", username: "neonNinja",
    email: "neon@gamergab.com", password: "pass123",
    profilePic: "https://i.pravatar.cc/150?u=neonNinja", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p2", "p6"], retweets: [],
    following: ["u3", "u5"], followers: ["u1", "u3"],
    createdAt: new Date(now - 20 * DAY).toISOString(),
    updatedAt: new Date(now - 3 * DAY).toISOString(),
  },
  {
    _id: "u5",
    firstName: "Cosmic", lastName: "Cat", username: "cosmicCat",
    email: "cosmic@gamergab.com", password: "pass123",
    profilePic: "https://i.pravatar.cc/150?u=cosmicCat", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p1", "p3", "p7"], retweets: [],
    following: ["u1", "u6"], followers: ["u4"],
    createdAt: new Date(now - 18 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
  },
  {
    _id: "u6",
    firstName: "Bit", lastName: "Boss", username: "bitBoss",
    email: "bit@gamergab.com", password: "pass123",
    profilePic: "https://i.pravatar.cc/150?u=bitBoss", coverPhoto: "/images/coverPhoto.jpg",
    likes: ["p4", "p5"], retweets: [],
    following: ["u1"], followers: ["u5"],
    createdAt: new Date(now - 15 * DAY).toISOString(),
    updatedAt: new Date(now - 2 * DAY).toISOString(),
  },
];

// ── Posts ──────────────────────────────────────────────
const posts = [
  { _id: "p1", content: "Just finished a 12-hour speedrun of Hollow Knight. New PB! 🎮", postedBy: "u1", likes: ["u2", "u3", "u5"], retweetUsers: [], retweetData: null, replyTo: null, pinned: true, createdAt: new Date(now - 6 * DAY).toISOString(), updatedAt: new Date(now - 6 * DAY).toISOString() },
  { _id: "p2", content: "Anyone else hyped for the new Elden Ring DLC? Can't wait to get destroyed by new bosses 😤", postedBy: "u2", likes: ["u3", "u4"], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 5.5 * DAY).toISOString(), updatedAt: new Date(now - 5.5 * DAY).toISOString() },
  { _id: "p3", content: "Hot take: turn-based RPGs are still the best genre. Fight me.", postedBy: "u3", likes: ["u1", "u5"], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 5 * DAY).toISOString(), updatedAt: new Date(now - 5 * DAY).toISOString() },
  { _id: "p4", content: "Built a redstone computer in Minecraft today. It can add numbers up to 15!", postedBy: "u4", likes: ["u2", "u6"], retweetUsers: ["u1"], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 4.5 * DAY).toISOString(), updatedAt: new Date(now - 4.5 * DAY).toISOString() },
  { _id: "p5", content: "Streaming some ranked matches tonight at 8pm EST. Come hang out! 🔴", postedBy: "u5", likes: ["u1", "u6"], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 4 * DAY).toISOString(), updatedAt: new Date(now - 4 * DAY).toISOString() },
  { _id: "p6", content: "The soundtrack in Celeste is absolutely god-tier. That's it. That's the post.", postedBy: "u6", likes: ["u4"], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 3.5 * DAY).toISOString(), updatedAt: new Date(now - 3.5 * DAY).toISOString() },
  { _id: "p7", content: "PSA: your backlog is not a to-do list. Play what makes you happy.", postedBy: "u1", likes: ["u5"], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 3 * DAY).toISOString(), updatedAt: new Date(now - 3 * DAY).toISOString() },
  { _id: "p8", content: "Finally beat Malenia solo. Took 147 attempts but we don't talk about that.", postedBy: "u2", likes: [], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 2.5 * DAY).toISOString(), updatedAt: new Date(now - 2.5 * DAY).toISOString() },
  { _id: "p9", content: "Looking for a co-op partner for It Takes Two. Anyone down?", postedBy: "u3", likes: [], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 2 * DAY).toISOString(), updatedAt: new Date(now - 2 * DAY).toISOString() },
  { _id: "p10", content: "Just discovered Vampire Survivors and there goes my weekend 😂", postedBy: "u4", likes: [], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 1.5 * DAY).toISOString(), updatedAt: new Date(now - 1.5 * DAY).toISOString() },
  { _id: "p11", content: "My cat walked across my keyboard mid-match and somehow got a kill", postedBy: "u5", likes: [], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 1 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString() },
  { _id: "p12", content: "GG to everyone in tonight's tournament. See you all next week!", postedBy: "u6", likes: [], retweetUsers: [], retweetData: null, replyTo: null, pinned: false, createdAt: new Date(now - 0.5 * DAY).toISOString(), updatedAt: new Date(now - 0.5 * DAY).toISOString() },
  // Replies
  { _id: "p13", content: "Congrats! What was your final time?", postedBy: "u2", likes: ["u1"], retweetUsers: [], retweetData: null, replyTo: "p1", pinned: false, createdAt: new Date(now - 5.9 * DAY).toISOString(), updatedAt: new Date(now - 5.9 * DAY).toISOString() },
  { _id: "p16", content: "I'm down! DM me your Steam name.", postedBy: "u1", likes: [], retweetUsers: [], retweetData: null, replyTo: "p9", pinned: false, createdAt: new Date(now - 1.9 * DAY).toISOString(), updatedAt: new Date(now - 1.9 * DAY).toISOString() },
  { _id: "p17", content: "147?! Respect. I gave up at 50 😅", postedBy: "u4", likes: ["u2"], retweetUsers: [], retweetData: null, replyTo: "p8", pinned: false, createdAt: new Date(now - 2.4 * DAY).toISOString(), updatedAt: new Date(now - 2.4 * DAY).toISOString() },
  // Retweets
  { _id: "p14", content: null, postedBy: "u1", likes: [], retweetUsers: [], retweetData: "p4", replyTo: null, pinned: false, createdAt: new Date(now - 4.4 * DAY).toISOString(), updatedAt: new Date(now - 4.4 * DAY).toISOString() },
  { _id: "p15", content: null, postedBy: "u3", likes: [], retweetUsers: [], retweetData: "p5", replyTo: null, pinned: false, createdAt: new Date(now - 3.9 * DAY).toISOString(), updatedAt: new Date(now - 3.9 * DAY).toISOString() },
];

// ── Chats ──────────────────────────────────────────────
const chats = [
  { _id: "c1", chatName: null, isGroupChat: false, users: ["u1", "u2"], latestMessage: "m3", createdAt: new Date(now - 10 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString() },
  { _id: "c2", chatName: null, isGroupChat: false, users: ["u1", "u3"], latestMessage: "m5", createdAt: new Date(now - 8 * DAY).toISOString(), updatedAt: new Date(now - 2 * DAY).toISOString() },
  { _id: "c3", chatName: "Game Night Crew", isGroupChat: true, users: ["u1", "u2", "u3", "u4"], latestMessage: "m8", createdAt: new Date(now - 5 * DAY).toISOString(), updatedAt: new Date(now - 0.5 * DAY).toISOString() },
];

// ── Messages ───────────────────────────────────────────
const messages = [
  { _id: "m1", sender: "u1", content: "Hey! GG on that last match", chat: "c1", readBy: ["u1", "u2"], createdAt: new Date(now - 3 * DAY).toISOString(), updatedAt: new Date(now - 3 * DAY).toISOString() },
  { _id: "m2", sender: "u2", content: "Thanks! We should duo queue more often", chat: "c1", readBy: ["u1", "u2"], createdAt: new Date(now - 2.5 * DAY).toISOString(), updatedAt: new Date(now - 2.5 * DAY).toISOString() },
  { _id: "m3", sender: "u1", content: "For sure, I'm free tonight after 8", chat: "c1", readBy: ["u1"], createdAt: new Date(now - 1 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString() },
  { _id: "m4", sender: "u3", content: "You still have my copy of Hades?", chat: "c2", readBy: ["u3"], createdAt: new Date(now - 3 * DAY).toISOString(), updatedAt: new Date(now - 3 * DAY).toISOString() },
  { _id: "m5", sender: "u1", content: "Oh yeah, I'll bring it Friday", chat: "c2", readBy: ["u1", "u3"], createdAt: new Date(now - 2 * DAY).toISOString(), updatedAt: new Date(now - 2 * DAY).toISOString() },
  { _id: "m6", sender: "u2", content: "So are we doing game night this Saturday?", chat: "c3", readBy: ["u1", "u2", "u3"], createdAt: new Date(now - 1 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString() },
  { _id: "m7", sender: "u4", content: "I'm in! What are we playing?", chat: "c3", readBy: ["u4"], createdAt: new Date(now - 0.8 * DAY).toISOString(), updatedAt: new Date(now - 0.8 * DAY).toISOString() },
  { _id: "m8", sender: "u1", content: "Let's do Jackbox and then some Smash", chat: "c3", readBy: ["u1"], createdAt: new Date(now - 0.5 * DAY).toISOString(), updatedAt: new Date(now - 0.5 * DAY).toISOString() },
];

// ── Populate helpers ───────────────────────────────────
function populateUser(id) {
  if (!id) return null;
  if (typeof id === "object" && id._id) return clone(id);
  const u = users.find(u => u._id === id);
  return u ? clone(u) : null;
}

function populatePost(id) {
  if (!id) return null;
  if (typeof id === "object" && id._id) return clone(id);
  const p = posts.find(p => p._id === id);
  return p ? clone(p) : null;
}

function populateMessage(id) {
  if (!id) return null;
  if (typeof id === "object" && id._id) return clone(id);
  const m = messages.find(m => m._id === id);
  return m ? clone(m) : null;
}

function populateChat(id) {
  if (!id) return null;
  if (typeof id === "object" && id._id) return clone(id);
  const c = chats.find(c => c._id === id);
  return c ? clone(c) : null;
}

// Returns a fully populated copy of a post (postedBy, retweetData, replyTo, nested postedBy)
function populatePostFull(post) {
  const p = clone(post);
  p.postedBy = populateUser(p.postedBy);
  if (p.retweetData) {
    p.retweetData = populatePost(p.retweetData);
    if (p.retweetData) p.retweetData.postedBy = populateUser(p.retweetData.postedBy);
  }
  if (p.replyTo) {
    p.replyTo = populatePost(p.replyTo);
    if (p.replyTo) p.replyTo.postedBy = populateUser(p.replyTo.postedBy);
  }
  return p;
}

// ── User helpers ───────────────────────────────────────
function getUserById(id) {
  const u = users.find(u => u._id === id);
  return u ? clone(u) : null;
}

function getUserByUsername(username) {
  const u = users.find(u => u.username === username);
  return u ? clone(u) : null;
}

function getUserByEmail(email) {
  const u = users.find(u => u.email === email);
  return u ? clone(u) : null;
}

function searchUsers(query) {
  const re = new RegExp(query, "i");
  return users
    .filter(u => re.test(u.firstName) || re.test(u.lastName) || re.test(u.username))
    .map(u => clone(u));
}

function createUser(data) {
  const id = genId();
  const ts = new Date().toISOString();
  const user = {
    _id: id,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    username: data.username.trim(),
    email: data.email.trim(),
    password: data.password,
    profilePic: "/images/profilePic.png",
    coverPhoto: "/images/coverPhoto.jpg",
    likes: [], retweets: [], following: [], followers: [],
    createdAt: ts, updatedAt: ts,
  };
  users.push(user);
  return clone(user);
}

function updateUser(id, updates) {
  const u = users.find(u => u._id === id);
  if (!u) return null;
  Object.assign(u, updates);
  u.updatedAt = new Date().toISOString();
  return clone(u);
}

// Get the raw (mutable) user ref — for array toggling
function _getRawUser(id) {
  return users.find(u => u._id === id);
}

// ── Post helpers ───────────────────────────────────────
function getAllPosts() {
  return posts.map(p => populatePostFull(p)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getPostById(id) {
  const p = posts.find(p => p._id === id);
  return p ? populatePostFull(p) : null;
}

function createPost(data) {
  const id = genId();
  const ts = new Date().toISOString();
  const post = {
    _id: id,
    content: data.content || null,
    postedBy: data.postedBy,
    likes: [],
    retweetUsers: [],
    retweetData: data.retweetData || null,
    replyTo: data.replyTo || null,
    pinned: false,
    createdAt: ts, updatedAt: ts,
  };
  posts.push(post);
  return populatePostFull(post);
}

function updatePost(id, updates) {
  const p = posts.find(p => p._id === id);
  if (!p) return null;
  Object.assign(p, updates);
  p.updatedAt = new Date().toISOString();
  return clone(p);
}

function deletePost(id) {
  const idx = posts.findIndex(p => p._id === id);
  if (idx === -1) return null;
  return posts.splice(idx, 1)[0];
}

function unpinAllByUser(userId) {
  posts.forEach(p => { if (p.postedBy === userId) p.pinned = false; });
}

// Get raw (mutable) post ref — for array toggling
function _getRawPost(id) {
  return posts.find(p => p._id === id);
}

// ── Chat helpers ───────────────────────────────────────
function getChats() {
  return chats.map(c => {
    const cc = clone(c);
    cc.users = cc.users.map(populateUser);
    if (cc.latestMessage) {
      cc.latestMessage = populateMessage(cc.latestMessage);
      if (cc.latestMessage) cc.latestMessage.sender = populateUser(cc.latestMessage.sender);
    }
    return cc;
  });
}

function getChatById(id) {
  const c = chats.find(c => c._id === id);
  if (!c) return null;
  const cc = clone(c);
  cc.users = cc.users.map(populateUser);
  if (cc.latestMessage) {
    cc.latestMessage = populateMessage(cc.latestMessage);
    if (cc.latestMessage) cc.latestMessage.sender = populateUser(cc.latestMessage.sender);
  }
  return cc;
}

function createChat(data) {
  const id = genId();
  const ts = new Date().toISOString();
  const chat = {
    _id: id,
    chatName: data.chatName || null,
    isGroupChat: data.isGroupChat || false,
    users: data.users, // array of user IDs
    latestMessage: null,
    createdAt: ts, updatedAt: ts,
  };
  chats.push(chat);
  const cc = clone(chat);
  cc.users = cc.users.map(populateUser);
  return cc;
}

function updateChat(id, updates) {
  const c = chats.find(c => c._id === id);
  if (!c) return null;
  Object.assign(c, updates);
  c.updatedAt = new Date().toISOString();
  return clone(c);
}

function findDMChat(userId1, userId2) {
  const c = chats.find(c =>
    !c.isGroupChat &&
    c.users.length === 2 &&
    c.users.includes(userId1) &&
    c.users.includes(userId2)
  );
  if (!c) return null;
  const cc = clone(c);
  cc.users = cc.users.map(populateUser);
  return cc;
}

// ── Message helpers ────────────────────────────────────
function getMessages(chatId) {
  return messages
    .filter(m => m.chat === chatId)
    .map(m => { const mc = clone(m); mc.sender = populateUser(mc.sender); return mc; });
}

function createMessage(data) {
  const id = genId();
  const ts = new Date().toISOString();
  const msg = {
    _id: id,
    sender: data.sender,
    content: data.content,
    chat: data.chat,
    readBy: [data.sender],
    createdAt: ts, updatedAt: ts,
  };
  messages.push(msg);
  // Update chat's latestMessage
  const chat = chats.find(c => c._id === data.chat);
  if (chat) { chat.latestMessage = id; chat.updatedAt = ts; }
  const mc = clone(msg);
  mc.sender = populateUser(mc.sender);
  mc.chat = populateChat(mc.chat);
  if (mc.chat) mc.chat.users = mc.chat.users.map(populateUser);
  return mc;
}

module.exports = {
  getUserById, getUserByUsername, getUserByEmail, searchUsers, createUser, updateUser, _getRawUser,
  getAllPosts, getPostById, createPost, updatePost, deletePost, unpinAllByUser, _getRawPost, populatePostFull,
  getChats, getChatById, createChat, updateChat, findDMChat,
  getMessages, createMessage,
};
