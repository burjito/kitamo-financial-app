# Email Verification Setup Guide

## 1. Update your .env.local file

Make sure your `.env.local` file has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to your domain when deployed
```

## 2. Configure Supabase Email Settings

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Find "Site URL" and set it to: `http://localhost:3000` (for development)
3. Find "Redirect URLs" and add: `http://localhost:3000/api/auth/verify-email`

For production, replace `localhost:3000` with your actual domain.

## 3. Email Template Configuration

In Supabase dashboard > Authentication > Email Templates:

1. Select "Confirm signup" template
2. Make sure the confirmation URL uses: `{{ .ConfirmationURL }}`
3. The button should link to: `{{ .ConfirmationURL }}`

## 4. Testing the Flow

1. Fill out the signup form
2. Check your email for the verification message
3. Click "Confirm My Account" button
4. You should be redirected to the success page
5. Then you can login normally

## 5. How it Works

1. User signs up → Account created (unverified)
2. Email sent with verification link pointing to `/api/auth/verify-email`
3. User clicks link → API route processes verification
4. Success → Redirected to `/auth/verify-success`
5. Error → Redirected to `/auth/verify-error`

## 6. Available Pages

- `/auth/verify-success` - Shows success message and redirects to login
- `/auth/verify-error` - Shows error message with retry options
- `/auth/check-verification` - Check current verification status

## 7. Production Deployment

When deploying to production:
1. Update `NEXT_PUBLIC_SITE_URL` to your domain
2. Update Supabase Site URL and Redirect URLs
3. Test the flow on your live domain

## Troubleshooting

- If "site can't be reached" → Check Site URL and Redirect URL settings
- If verification fails → Check console logs and Supabase auth logs
- If email not received → Check Supabase email configuration and spam folder
