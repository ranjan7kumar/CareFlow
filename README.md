# CareFlow — Hospital Management Mobile App

CareFlow is a React Native mobile application built with Expo and TypeScript.

## Features

- Hospital home screen with departments and diagnostic services.
- Staff dashboard with summary cards and quick actions.
- Doctor directory with search and specialty filters.
- Doctor profiles and appointment booking.
- My Bookings screen with cancellation support.
- Patient search using sample records.
- Explore departments, diagnostics, and facilities.
- Three-step patient follow-up workflow.

## Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons

## Prerequisites

- Node.js and npm
- Expo Go or a compatible simulator

## Installation

Install dependencies:

    npm install

Start the app:

    npx expo start

Check TypeScript:

    npx tsc --noEmit

## Test Cases

| ID | Test | Expected Result |
|---|---|---|
| TC-01 | Open Home | Home screen appears |
| TC-02 | Open Dashboard | Statistics and quick actions appear |
| TC-03 | Search doctors | Matching doctors appear |
| TC-04 | Open doctor profile | Correct doctor details appear |
| TC-05 | Book appointment | Confirmation appears and booking is saved locally |
| TC-06 | Open My Bookings | Saved appointments are listed |
| TC-07 | Cancel appointment | Status changes to Cancelled |
| TC-08 | Search patients | Matching sample records appear |
| TC-09 | Complete follow-up workflow | Confirmation shows entered details |
| TC-10 | Search Explore | Matching services appear |
| TC-11 | Run TypeScript check | No TypeScript errors |

Mark tests Pass or Fail only after manually testing each case.

## Data and Limitations

- Doctor and patient records are sample demonstration data.
- Appointment records are stored locally using AsyncStorage.
- The follow-up confirmation is a demonstration; it does not create a real hospital appointment or save information to a clinical backend.
- The application is a prototype, not a production hospital system.
- Remote doctor images may require an internet connection.

## Project Structure

    src/app/
      _layout.tsx
      index.tsx
      dashboard.tsx
      doctors.tsx
      doctor-profile.tsx
      booking.tsx
      my-bookings.tsx
      patients.tsx
      explore.tsx
      follow-up.tsx
      follow-up-details.tsx
      follow-up-confirmation.tsx

## AI Assistance Disclosure

AI tools assisted with code drafting, debugging, navigation flows, and documentation. The developer should review and understand the submitted implementation and update this disclosure to accurately reflect the actual assistance used.

## Submission Checklist

- [ ] Source code or repository link
- [ ] Required screenshots
- [ ] Test results with actual Pass/Fail status
- [ ] Sample input and output
- [ ] Documentation and results report
- [ ] Accurate AI assistance disclosure
- [ ] Actual time spent and external assistance, if required

