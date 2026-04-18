# Digital Gate Pass System

This is a full-stack web application that helps to manage gate pass requests in a digital way instead of using paper.

Students can apply for gate passes online, and the requests go through an approval process by the coordinator and HOD.

**Live Application:** https://digital-gatepass-system.vercel.app

---

## Overview

In many colleges, gate passes are handled manually, which can be slow and difficult to manage. This project provides a simple digital solution.

Students can submit requests, and staff members can review and approve them step by step. All requests are stored and can be tracked easily.

---

## Tech Stack

**Frontend**
- React (Vite)
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT (authentication)

**Additional Integration**
- Python (used for a basic ML integration)

---

## Features

- **Login and Registration**
  - Secure user authentication  

- **Role-Based Access**
  - Student  
  - Coordinator  
  - HOD  

- **Gate Pass Request**
  - Students can apply with reason and details  
  - File upload support  

- **Approval Process**
  - Coordinator reviews the request  
  - HOD gives final decision  
  - Requests can be approved or rejected  

- **Dashboards**
  - Separate dashboard for each role  

- **Request Tracking**
  - Students can check status (pending/approved/rejected)  
  - View previous requests  

- **ML Integration**
  - A basic ML component is integrated to support request analysis  

- **Notifications**
  - SMS updates for request status  

---

## How the System Works

1. Student logs in and submits a request  
2. Request is stored in the database  
3. Coordinator reviews the request  
4. HOD gives final approval or rejection  
5. Student can track the request status  

---

## Project Structure

```
digital-gatepass-system/
├── Backend/
├── Frontend/
├── ml/
```

---

## How to Run the Project

Make sure you have Node.js and Python installed. Also install all required dependencies before running each part of the project.

### Clone the repository
```
git clone https://github.com/ramu1623/digital-gatepass-system.git
cd digital-gatepass-system
```

### ML Service
```
cd ml
pip install -r requirements.txt
python app.py
```

### Backend
```
cd Backend
npm install
npm start
```

### Frontend
```
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in Backend:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

Create a `.env` file in Frontend also:

```
VITE_API_URL=https://your-backend-url
```


---


## Note

This project was developed as part of a team assignment. The main development and integration of the system were handled by me.
