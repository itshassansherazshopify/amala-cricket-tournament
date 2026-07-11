# AMAALA Tape Ball Cricket Tournament 2026

Team registration form for the AMAALA Tape Ball Cricket Tournament 2026.

## Open Locally

Open `index.html` in your browser to view the page.

The email API works after deploying to Vercel and adding the environment variables below.

## Email Setup on Vercel

This project uses Resend for direct email delivery from the Vercel serverless function.

Add these environment variables in Vercel:

- `RESEND_API_KEY`
- `REGISTRATION_TO_EMAIL`
- `REGISTRATION_FROM_EMAIL`

`REGISTRATION_TO_EMAIL` is the organizer email that receives registrations.

`REGISTRATION_FROM_EMAIL` must be a verified sender in Resend.
