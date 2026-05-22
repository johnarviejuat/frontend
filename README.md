1.RUNNING THE FRONTEND (REACT UI)

System Requirements:
- Node.js (v18+ recommended)
- npm package manager

Execution Steps:
1. Open a command prompt or terminal window.
2. Navigate directly to the frontend folder directory:
   cd frontend
3. Install the application dependencies:
   npm install
4. Start the local Vite development web server:
   npm run dev
5. Open the browser to the local address provided in the console 
   (typically http://localhost:5173).

CRITICAL: Environment Variable Match (.env)
The frontend relies on an environment configuration file to locate your 
backend service without using browser local storage.

1. Open the file named '.env' inside the root of your 'frontend' folder.
2. Make sure the 'VITE_API_BASE_URL' port matches your running Visual 
   Studio HTTPS port number exactly:
   VITE_API_BASE_URL=https://localhost:[YOUR_BACKEND_PORT_NUMBER]

The backend API project must be kept running in the background for the 
frontend onboarding form to submit data and load the customer directory successfully.
