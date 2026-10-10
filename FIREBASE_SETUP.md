# Firebase setup

1. In the Firebase console, create or select a project and add a Web app.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a **Cloud Firestore** database and publish the rules from `firestore.rules`.
4. Copy the Web app configuration into a new `.env` file in this project, following `.env.example`. Keep `.env` local; it is ignored by Git.
5. Start the site with `npm run dev`, then try creating an account and logging in.

Firebase Authentication stores and verifies passwords. The `users/{uid}` Firestore document stores only the user's full name, email, and creation time. The rules allow a signed-in user to create and read only their own profile document.
