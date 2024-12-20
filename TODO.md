# Todo List

## Authentication Setup
- [ ] Configure Supabase Authentication
  1. Email/Password Authentication
     - Enable "Confirm email" in Supabase dashboard
  
  2. Google Authentication
     - Set up Google Cloud Console project
     - Configure OAuth credentials
     - Add redirect URLs
     - Add Client ID and Secret to Supabase
     ```
     Redirect URLs needed:
     https://<your-project>.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
  
  3. Apple Authentication
     - Set up Apple Developer account
     - Configure Sign In with Apple
     - Generate necessary keys
     - Add credentials to Supabase
  
  4. Environment Variables
     - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

Date Added: 2024-12-20