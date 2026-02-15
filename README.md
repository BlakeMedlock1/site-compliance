1. Prerequisites
Before starting, ensure the following are installed on your machine:

Node.js (v18 or higher): To run the JavaScript environment.

Git: To manage the source code versioning.

Expo Go: (On a physical mobile device) to preview the app.

A Supabase Account: To host the database and authentication.

2. Backend Setup (Supabase)
The app relies on a cloud database to store incident reports and user IDs.

Create a new project in the Supabase Dashboard.

Database Tables: Run the SQL script found in Appendix B (or the schema.sql file) in the Supabase SQL Editor. This will create the incidents, contractors, and audit_logs tables.

Under Authentication, enable "Email/Password" login.

Ensure Row Level Security is toggled ON for all tables to protect data.

3. Frontend Setup (React Native/Expo)
Open your terminal in the project folder and type:
npm install
This downloads all the parts the app needs to run (like React Navigation and the Supabase Client).

Create a file named .env in the root folder and paste your Supabase URL and Anon Key:
EXPO_PUBLIC_SUPABASE_URL=your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here

4. Launching the System
In your terminal, run:
npx expo start

A QR code will appear. Scan this with your phone’s camera (using the Expo Go app).

The app will build and open. You can now log an incident, take a photo, and see it appear in the Supabase dashboard in real-time.

5. Running Automated Tests
To verify the system is working exactly as it did during development:

Unit Tests: Run npm test to trigger the Jest suite.

End-to-End Tests: Ensure a mobile emulator is open and run:
maestro test .maestro/flow.yaml
This will automatically click through the app to verify the "Incident Reporting" flow works without errors.
