Create or update the Ratings & Reviews system for the marketplace.

This task is about FRONT-END UX/UI if used in Figma, and about full implementation if used in Replit.

The platform must support reviews and ratings for:
• Hosts
• Employers
• Participants
• Providers, if Provider profiles exist

REVIEW BASICS

Users should be able to:
• Select a star rating from 1 to 5
• Write a text review
• Upload photos
• Upload videos
• Submit the review
• See the review publicly displayed on the reviewed profile

The review should look and behave similarly to Google-style reviews:
• Star rating
• Written comment
• Optional media attachments
• Date posted
• Reviewer name/profile
• Reviewed person/business profile
• Public visibility
• Report review option

WHO CAN REVIEW WHOM

Participants can review:
• Hosts after a valid booking relationship
• Employers after a valid work/employer connection
• Providers after a valid service relationship

Hosts can review:
• Participants after a valid booking relationship
• Providers after a valid service relationship, if applicable

Employers can review:
• Participants after a valid work relationship
• Providers after a valid service relationship, if applicable

Providers can review:
• Participants, Hosts, or Employers only after a valid service relationship, if applicable

Important:
Do not allow random users to review people/businesses without a real relationship.
Reviews must be connected to a booking, work relationship, or service relationship.

REVIEW SUBMISSION FLOW

Create screens/components for:
• Leave a review button
• Review form
• Star rating selector
• Text review box
• Photo upload
• Video upload
• Submit review button
• Review submitted confirmation
• Edit review option, if allowed
• Review history

Suggested review form fields:
• Overall rating
• Written review
• Photos/videos
• Optional category ratings

Optional category ratings for Hosts:
• Housing accuracy
• Cleanliness
• Safety
• Communication
• Value
• Deposit fairness

Optional category ratings for Employers:
• Job accuracy
• Communication
• Work environment
• Scheduling fairness
• Pay transparency
• Support

Optional category ratings for Participants:
• Communication
• Respectfulness
• Payment reliability
• Cleanliness
• Rule compliance

PUBLIC REVIEW DISPLAY

Create public review sections on:
• Host profile
• Employer profile
• Participant profile
• Provider profile, if applicable
• Listing detail page, if host reviews should be shown there

Each profile should show:
• Average star rating
• Total number of reviews
• Rating breakdown by stars
• Review cards
• Uploaded photos/videos
• Sort reviews by newest/highest/lowest
• Filter reviews by rating
• Report review button

RATING CALCULATION

The average rating must be calculated from submitted star ratings.

The profile rating should update when a new review is submitted.

Display:
• Average rating, example: 4.7
• Total reviews, example: 128 reviews
• Star breakdown, example: 5 stars, 4 stars, 3 stars, etc.

Ratings should affect:
• Host ranking
• Employer ranking
• Participant trust score / profile trust
• Provider ranking, if providers exist

REVIEW OWNERSHIP AND DELETION RULES

The person or business receiving the review must NOT be able to delete the review.

The reviewed user can only:
• Report the review
• Respond publicly, if response feature is added
• Send a moderation request to Admin

The reviewer may be allowed to:
• Edit their own review
• Delete their own review, if platform policy allows
• Add media later, if allowed

If unsure, create UI for:
• Edit my review
• Delete my review
but keep delete/edit permissions separate from the reviewed user.

REPORT REVIEW FLOW

Create “Report Review” flow.

The reviewed user or any platform user can report a review.

Report reasons:
• Fake review
• Harassment or abusive language
• Discrimination
• Private information shared
• Irrelevant content
• Spam
• False information
• Threats or safety concern
• Inappropriate photo/video
• Other

Report review form:
• Select reason
• Write optional comment
• Submit report
• Show confirmation

The report should go to Admin for moderation.

ADMIN REVIEW MODERATION

Create Admin moderation screens for reviews.

Admin should see:
• Reported review
• Reviewer profile
• Reviewed profile
• Star rating
• Text review
• Uploaded photos/videos
• Original booking/work/service relationship
• Report reason
• Reporter comment
• Review history
• Date posted

Admin actions:
• Keep review visible
• Hide review temporarily
• Remove review
• Request edit from reviewer
• Dismiss report
• Mark review as verified
• Add internal admin note

Review statuses:
• Published
• Reported
• Under review
• Hidden
• Removed
• Verified
• Dismissed

REVIEW RESPONSES

Create optional response UI.

The reviewed Host, Employer, Participant, or Provider may be able to publicly respond to a review.

Response rules:
• Response should appear under the review
• Response can also be reported
• Admin can moderate responses

If this feels too much for MVP, create placeholder UI only.

MEDIA UPLOADS

Reviews must support:
• Photo uploads
• Video uploads

Show:
• Media preview before posting
• Uploaded media gallery in review card
• Remove media before submission
• Report inappropriate media

Media should be visible publicly unless removed by moderation.

TRUST AND SAFETY

Add warnings:
• Reviews should be honest and based on real experience.
• Do not share private personal information.
• Do not use abusive, discriminatory, or threatening language.
• Reviews may be moderated if reported.

MOBILE-FIRST REQUIREMENTS

Make the entire review system mobile-friendly.

Create mobile screens for:
• Leave review
• Upload photos/videos
• Public reviews list
• Rating breakdown
• Report review
• Admin moderation
• Review response

FINAL REQUIREMENT

Create actual visible screens and clickable front-end flows for the ratings and reviews system.

Do not only describe the logic.

Reviews and star ratings are a core trust feature of this marketplace, so the UI must feel polished, transparent, and similar in trust level to Google reviews or Airbnb reviews.
