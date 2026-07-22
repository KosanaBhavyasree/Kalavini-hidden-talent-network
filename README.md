# 🎨 Kalavini - Hidden Talent Network

Kalavini is a MERN Stack based skill-sharing platform where people can teach, learn, and exchange skills with others. It connects users based on complementary skills, making learning collaborative and accessible.

---

## 🌟 Features

- User Registration & Login (JWT Authentication)
- Secure Password Hashing using bcrypt
- User Profile Management
- Add Skills
- Browse Skills
- Skill Matching Algorithm
- Skill Details Page
- Send Skill Exchange Requests
- Accept / Reject Requests
- Notifications
- Responsive Dashboard

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Express Validator

---

## 📂 Project Structure

```
kalavini-hidden-talent-network/

│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
```

---

## 🚀 Modules

### Authentication
- Register
- Login
- JWT Authentication

### User
- Update Profile
- View Profile

### Skills
- Add Skill
- Browse Skills
- Skill Details

### Matching
- Automatically finds users whose teaching and learning skills complement each other.

Example:

User A
- Teaches: Driving
- Wants: Hindi

User B
- Teaches: Hindi
- Wants: Driving

➡️ Kalavini matches them.

### Requests
- Send Request
- Accept Request
- Reject Request

### Notifications
- Request Received
- Request Accepted
- Request Rejected

---

## 🔒 Authentication

Kalavini uses **JWT (JSON Web Token)** for secure authentication.

Flow:

```
Register

↓

Password Hashing (bcrypt)

↓

MongoDB

↓

Login

↓

JWT Token Generated

↓

Frontend Stores Token

↓

Protected Routes
```

---

## 📊 Database Collections

### Users

- name
- email
- password
- bio
- skillsToTeach
- skillsToLearn
- location
- availability
- profilePicture

### Skills

- title
- description
- category
- difficulty
- availability
- desiredSkillExchange
- teacher

### Requests

- sender
- receiver
- skill
- status

### Notifications

- recipient
- message
- type
- isRead

---

## 🔄 Project Flow

```
Register

↓

Login

↓

Dashboard

↓

Update Profile

↓

Add Skill

↓

Browse Skills

↓

Matching

↓

View Skill

↓

Send Request

↓

Receiver Accepts / Rejects

↓

Notification
```

---

## 🧠 Matching Logic

Kalavini compares:

```
My Skills To Teach
        ↕

Their Skills To Learn

AND

My Skills To Learn
        ↕

Their Skills To Teach
```

Higher overlap results in a higher match percentage.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/kalavini-hidden-talent-network.git
```

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Server (.env)

```
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
CLIENT_URL=http://localhost:5173
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000/api
```

---

## 📸 Screenshots

- Login
- Dashboard
- Profile
- Browse Skills
- Add Skill
- Skill Details
- Matching
- Requests
- Notifications

(Add screenshots here.)

---

## 👨‍💻 Future Enhancements

- Real-time Chat
- Video Calling
- Ratings & Reviews
- Skill Certificates
- AI Skill Recommendations
- Search & Filters
- Email Notifications
- File Sharing

---

## 👨‍🎓 Developed By

**Kosana BhavyaSree**

B.Tech (Electronics and communication Engineering)

Nadimpalli Satyanarayana Raju Institute of Technology

---

## 📜 License

This project is developed for educational purposes.