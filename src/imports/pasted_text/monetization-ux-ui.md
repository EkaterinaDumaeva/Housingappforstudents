Create or update the FRONT-END UX/UI for the marketplace monetization system.

This task is about FRONT-END UX/UI if used in Figma, and about full implementation if used in Replit.

The monetization system has two main parts:

1. Sponsored housing listings for Hosts
2. Paid employer/job access for Participants

PART 1 — HOST SPONSORED LISTINGS

Hosts should be able to pay to boost their housing listings.

Create Host-side screens for:

• Boost listing CTA
• Boost listing pricing page
• Select listing to boost
• Select boost duration
• Payment confirmation screen
• Active boosts dashboard
• Boost performance screen
• Boost history screen

Boost duration options:

• 1 day
• 1 week
• 1 month

The actual prices can be placeholders for now.

Sponsored listing behavior:

• Boosted listings appear at the top of search results.
• Boosted listings must clearly display a “Sponsored” label.
• If multiple Hosts boost listings at the same time, boosted listings should rotate randomly.
• Paid boosted listings should not always appear in the exact same order.
• Rotation should give paid Hosts fair exposure.
• Boost frequency should also be affected by Host rating and reliability.

Important:
A Host with a lower rating should appear less often at the top even if they paid for boost.
A Host with a strong rating and reliability should get better sponsored exposure.

Sponsored ranking factors:
• Paid boost active
• Host rating
• Host reliability percentage
• Cancellation history
• Cases opened against Host
• Response rate

Create visual UI explaining:
“Sponsored listings rotate fairly among active boosts. Higher-rated and more reliable hosts may receive stronger placement.”

Admin should also have control over sponsored placement.

Admin-side sponsored listing tools:

• Manually boost a listing
• Set custom boost start date
• Set custom boost end date
• Pause boost
• Remove boost
• Mark listing as sponsored
• View all active sponsored listings
• View sponsored listing history

Admin manual boost should work even if Host did not pay, for platform testing, partnerships, promotions, or manual support.

Create Admin screens for:
• Sponsored Listings Manager
• Active Boosts
• Manual Boost Setup
• Boost Rotation Preview
• Sponsored Listing Performance

Participant-facing UI:

When Participants search housing, boosted listings should appear at the top and show:

• Sponsored label
• Listing photo
• Weekly rent
• Deposit
• Fees
• Rating
• Spots left
• Gender policy
• Approximate location

PART 2 — PARTICIPANT PAID EMPLOYER ACCESS

Participants can browse Employers for free, but full contact/job access is paid.

Free Participant access:

Participants can see:
• Employer name
• City
• Industry
• General job category
• Basic employer profile
• Public rating
• Whether employer is verified

Participants cannot see:
• Employer email
• Employer phone number
• Direct contact information
• Full job offer access
• Ability to message Employer
• Ability to receive/sign a job offer

Paid access:

Create a paid access flow for Participants.

Price:
• One-time payment: $14.99

After payment, Participant receives access to:
• In-platform messaging with Employers
• Ability to apply/contact Employers through the platform
• Ability to receive one active job offer
• Ability to accept or decline one job offer

Important:
Do NOT reveal Employer email or phone number directly.
Communication should happen inside the platform messenger.

Create Participant UI:

• Locked Employer Contact state
• Blurred/hidden contact details
• “Contact Employer” button
• Paywall screen
• $14.99 one-time access explanation
• Payment confirmation
• Employer messaging unlocked
• Job offer access unlocked

Paywall text should explain:

“Unlock employer access for $14.99. You will be able to message employers inside the platform and receive one active job offer. Employer phone numbers and emails remain protected.”

JOB OFFER LIMITATION

To prevent multiple Participants from sharing one paid account, access should be tied to one Participant account and one active job offer.

Rules:

• Participant can only have one active accepted/signed job offer at a time.
• If Participant already has an active accepted/signed job offer, other Employers cannot send another job offer.
• If Participant wants another offer, Participant must decline/cancel the existing offer first, according to policy.
• Employer should see a message if they try to send an offer to a Participant who already has an active accepted/signed job offer.
• Participant should see a message explaining they already have one active job offer.

Employer-side UI:

When Employer tries to send job offer:

If Participant has no active job offer:
• Show “Send Job Offer” button
• Employer can send offer through platform

If Participant already has active accepted/signed job offer:
• Disable “Send Job Offer”
• Show message:
“This Participant already has an active job offer. They must decline or cancel the current offer before receiving another one.”

Participant-side UI:

If Participant already has active job offer:
• Show active job offer card
• Show status
• Show employer name
• Show job location
• Show option to decline/cancel offer if allowed
• Show message:
“You already have one active job offer. To receive another offer, you must first cancel or decline your current offer.”

JOB OFFER STATUSES

Create job offer status UI:

• Not started
• Employer contacted
• Interview requested
• Interview scheduled
• Offer sent
• Offer accepted
• Offer declined
• Offer cancelled
• Offer expired

Participant dashboard should show:
• Employer access status
• Active job offer status
• Contacted employers
• Messages
• Job offer timeline

Employer dashboard should show:
• Participants contacted
• Offers sent
• Offer accepted/declined statuses
• Participants unavailable because they already have active offer

CONTACT PRIVACY AND ANTI-CIRCUMVENTION

Do not show Employer email or phone number directly after payment.
Keep all communication inside platform messenger.

Add message safety rules:

Users should not be able to send:
• Email addresses
• Phone numbers
• Zelle
• Venmo
• Cash App
• PayPal
• Telegram handles
• WhatsApp numbers
• “Pay outside the app”
• “Contact me outside the app”
• Other off-platform contact/payment attempts

If a Participant tries to send email, phone number, or outside contact info:
• Block the message from sending
• Show warning:
“Sharing contact information outside the platform is not allowed. If you continue, your account may be blocked and your payment will not be refunded.”

If an Employer tries to send email, phone number, or outside contact info:
• Block the message from sending
• Show warning:
“Employer contact information must stay inside the platform. Sharing outside contact details may result in account suspension.”

Add report option:
• Report off-platform contact attempt
• Report payment outside platform request

ADMIN MONETIZATION DASHBOARD

Create Admin monetization screens:

• Sponsored listings revenue
• Active boosts
• Manual boosts
• Paid employer access purchases
• Participant job access status
• Job offer activity
• Blocked off-platform message attempts
• Reported monetization abuse
• Refund requests
• User payment history placeholder

Admin should be able to:
• See who paid for employer access
• See which Participants have unlocked Employer messaging
• See active job offers
• Manually grant or revoke Employer access
• Manually boost or unboost listings
• Review blocked message attempts
• Review monetization abuse reports

FRONT-END REQUIREMENTS

Create actual visible screens and clickable flows for:

Host:
• Boost listing
• Select boost plan
• Boost payment placeholder
• Active boosts
• Boost analytics

Participant:
• Locked employer profile
• Employer paywall
• $14.99 access screen
• Employer messaging unlocked
• Job offer status
• One active offer limitation
• Warning for off-platform contact attempts

Employer:
• Participant contact flow
• Send job offer
• Offer blocked because Participant already has active offer
• Job offer status tracking

Admin:
• Sponsored listings manager
• Paid access manager
• Manual boost tools
• Job offer monitoring
• Off-platform message attempts
• Monetization reports

FINAL REQUIREMENT

This monetization system should feel transparent, fair, and trustworthy.

Do not make it look scammy or aggressive.

Participants should clearly understand what they get for $14.99.
Hosts should clearly understand what sponsored placement means.
Sponsored listings must always be labeled as “Sponsored.”
Employer and Participant contact information must remain protected inside the platform.
