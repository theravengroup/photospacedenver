# SECURITY_RULES.md

## Third-Party Packages

Before installing third-party packages:
- verify package name
- verify official source
- check license
- check maintenance status
- check dependency count
- run npm audit
- avoid packages with broad postinstall scripts
- never expose secrets in client-side code

## Environment Variables

- use .env.local for local development
- never commit secrets
- document required variables in .env.example

## Supabase

- use RLS on user-facing tables
- do not expose service role keys client-side
- validate user access server-side

## Stripe

- verify webhooks
- do not trust client-submitted prices
- keep secret keys server-side

## Resend

- keep API key server-side
- validate form submissions before sending
