# Onboarding Flow

This directory contains the onboarding flow for new users after signup.

## Flow Structure

1. **OnboardingPage** (`/onboarding`)
   - Welcome screen with two options:
     - "I Know About Government Schemes" → Direct to schemes page
     - "I Don't Know - Help Me" → Go to questionnaire

2. **OnboardingQuestionsPage** (`/onboarding/questions`)
   - 5 MCQ questions about the business:
     - Business type (Manufacturing/Service/Trading/Technology)
     - Annual turnover
     - Number of employees
     - Type of funding needed
     - Business ownership category
   - Progress bar showing completion
   - After completion, redirects to schemes page with matching

3. **SchemesPage** (`/onboarding/schemes`)
   - Displays government schemes in card format
   - Shows match percentage for each scheme (based on questionnaire answers if provided)
   - Full-screen card layout with:
     - Scheme name and category
     - Match percentage badge
     - Description
     - Funding amount
     - Key benefits
     - Eligibility criteria
   - Users can:
     - Click on a card to see full details in a modal
     - Select/unselect schemes they're interested in
   - After selection, proceeds to business profile setup

## Dummy Data

All schemes and matching percentages are currently frontend-only dummy data:
- 6 government schemes included (MUDRA, Stand Up India, CLCSS, PMEGP, CGS, Startup India Seed Fund)
- Match percentages range from 75% to 95%
- Color-coded match indicators (Green: 85%+, Yellow: 70-84%, Orange: <70%)

## Next Steps

After onboarding, users are redirected to `/business/setup` to complete their profile.
