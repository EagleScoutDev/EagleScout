## Setting up the register team email trigger

This function is triggered when a new team is created and sends an email to a specified email list.

1. Go to the Database Webhooks page in the Supabase dashboard
2. Enable webhooks
3. Click on the "Add a new hook" button
4. Select the `register_team_requests` table on insert
5. Select "Supabase Edge Function" for the type of webhook
6. Select the register-team-email-trigger as the trigger 
7. Click the dropdown next to "Add a new header", select "Auth header with service key"
8. Click "Create Webhook"

## Setting up Environment Variables

The following environment variables must be set up in Supabase's Secret manager:

SMTP_USERNAME: The username to the SMTP account

SMTP_PASSWORD: The password to the SMTP account

EMAILS: A comma seperated list of emails to send the info to