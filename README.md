"# Architect Office System

A professional MERN (MongoDB, Express, React, Node.js) based application for managing architectural projects, meetings, documents, and client relationships.

## Features

✅ **User Authentication & Authorization**
- Role-based access control (Admin, Architect, Client)
- Secure JWT token authentication
- Password hashing with bcryptjs

✅ **Project Management**
- Create, read, update, and delete projects
- Track project status and phases
- Manage project budget and timeline
- Attach meetings and documents

✅ **Meeting Management**
- Schedule meetings with team members
- Add participants and set meeting details
- Track meeting status (scheduled, completed, cancelled)
- Date and time management

✅ **Document Management**
- Upload and organize documents
- Support for multiple document types (blueprint, license, contract, report)
- Version tracking
- Public/private document access
- Download functionality

✅ **Dashboard & Analytics**
- Project overview and statistics
- Recent activity tracking
- Quick access actions

✅ **Material-UI Interface**
- Modern, responsive design
- Professional UI components
- Mobile-friendly layout

## Tech Stack

### Frontend
- **React 19** - UI library
- **Material-UI v6** - Component library
- **React Router v7** - Navigation
- **Axios** - HTTP client with interceptors
- **React Context** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework (ES6 modules)
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
architect-office-system/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # Constants
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middlewares/          # Custom middlewares
│   ├── utils/                # Utility functions
│   ├── constants/            # Constants
│   ├── validators/           # Input validation
│   ├── index.js              # Express app
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/architect-office
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

App will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Meetings
- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `POST /api/meetings/:id/participants` - Add participant

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get document details
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/versions` - Get document versions

## User Roles

### Admin
- Full system access
- User management
- System configuration

### Architect
- Create and manage projects
- Schedule meetings
- Upload documents
- Assign clients to projects

### Client
- View assigned projects
- Participate in meetings
- Download documents
- Provide feedback

## Database Schema

### Users
- Full name, email, phone
- Password (hashed)
- Role (admin, architect, client)
- Profile information
- Account status

### Projects
- Title, description
- Architect and client references
- Status and phase tracking
- Budget and timeline
- Location information
- Related meetings and documents

### Meetings
- Title, description, date, duration
- Location, status
- Participants list
- Project reference
- Creator information

### Documents
- Name, type, file URL
- Project reference
- Uploader information
- Version tracking
- Visibility settings (public/private)

## Features Roadmap

- [ ] Real-time notifications
- [ ] Email notifications
- [ ] File upload to cloud storage
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] Mobile app
- [ ] Payment integration
- [ ] Document e-signature

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` configuration
- Check port 5000 availability

### Frontend API errors
- Verify backend server is running
- Check REACT_APP_API_URL in `.env`
- Clear browser cache and cookies

### Authentication issues
- Ensure JWT_SECRET is set in backend `.env`
- Check token expiration
- Verify CORS configuration

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the ISC License

## Support

For issues and questions, please create an issue in the repository.

## Authors

Graduation Project Team

## Acknowledgments

- Material-UI for excellent component library
- MongoDB for reliable database
- Express.js community for best practices" 
