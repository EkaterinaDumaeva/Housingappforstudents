Please audit the current app and implement the following marketplace-critical systems if they are missing or incomplete. This is a real Participant / Host / Employer marketplace, so please build full flows, database tables, UI screens, validation, role-based access, and admin moderation.

1. ADMIN DASHBOARD

Create a separate Admin Dashboard.

Admin should not be shown as a normal public role next to Participant, Host, and Employer. Admin access should be separate and protected.

Admin functions:
• Review deposit disputes / cases.
• Moderate reviews.
• Review reported listings.
• Remove scam or inaccurate listings.
• Block or suspend users.
• View user complaints.
• View emergency cases.
• View cancellation cases.
• View refund exception requests.
• View host verification applications.
• View reported messages.
• Add additional admins later.

For now, the first admin can be me, but the system must support adding more admins later.

Create admin tables/permissions as needed:
• admin_users
• reports
• admin_actions
• case_reviews
• verification_reviews

Admin dashboard sections:
• Pending disputes
• Reported listings
• Reported users
• Reported messages
• Host verification applications
• Refund exception requests
• Emergency support cases
• Cancellation reviews
• Review moderation
• User management
• Listing management
• Admin activity log

2. BOOKING STATUSES

Replace simple booked/not booked logic with full booking status flow.

Booking statuses:
• request_sent
• host_accepted
• deposit_pending
• deposit_paid
• confirmed
• cancelled_by_participant
• cancelled_by_host
• completed
• disputed

The booking status must be visible to Participant, Host, and Admin.

Status transitions must be logical:
• Participant sends request.
• Host accepts or declines.
• If host accepts, deposit becomes pending.
• After deposit payment, booking becomes confirmed.
• After move-out/check-out, booking becomes completed unless a dispute is opened.
• If a case is opened, booking becomes disputed.

3. DEPOSIT AND PAYOUT LOGIC

Implement protected deposit logic.

Deposit structure:
• Deposit is collected through the platform.
• 20% of the deposit is a host reservation fee.
• 80% of the deposit is refundable security deposit.
• The 20% reservation fee is NOT released to the host until the Participant successfully checks in.
• If the host cancels or fails to provide housing, the host does not receive the 20% reservation fee.
• The refundable portion is held until move-out/check-out.

Move-out deposit release logic:
• After Participant checks out, Host receives notification to release the deposit or open a case.
• Host has 3 days to respond.
• If Host does nothing within 3 days, the refundable deposit is automatically released back to Participant.
• If Host opens a case, Admin reviews the case.
• If Admin approves Host’s claim, the approved amount is deducted from the refundable deposit and sent to Host.
• The remaining amount is returned to Participant.
• If Admin rejects the claim, the refundable deposit returns to Participant.

Add UI for:
• Deposit breakdown: 20% reservation fee, 80% refundable security deposit.
• Deposit status.
• Host release deposit button.
• Host open case button.
• Participant refund status.
• Admin deposit case review.

4. WEEKLY RENT AND AUTOPAY

Implement weekly rent payment structure.

Requirements:
• Participant can pay rent weekly.
• Add optional weekly autopay.
• Participant can enable/disable autopay.
• Host can see weekly rent payment status.
• Admin can see payment records.
• Show paid / due / overdue status.
• Add payment history.
• Prepare Stripe Connect integration, but do not process real live payments until Stripe is fully configured.

5. CHECK-IN AND CHECK-OUT PROOF

Create check-in and check-out proof flows.

Participant proof:
• Participant must upload check-in proof after arrival.
• Participant must upload check-out proof before leaving or immediately after move-out.
• Proof can include photos, videos, and written notes.
• Proof must be timestamped.
• Proof cannot be deleted after submission.

Host proof:
• Host can also upload check-in/check-out proof.
• Host proof must also be timestamped and locked after submission.

Deadline logic:
• Add deadlines for proof uploads.
• If one side fails to upload proof by the deadline, that side becomes weaker in a dispute review.
• Show clear warnings before the deadline.

Admin:
• Admin can view both Participant and Host proof during disputes.

6. NO-SHOW POLICY AND EMERGENCY CASES

Implement no-show and arrival failure logic.

Scenarios:

A. Participant does not arrive:
• Host can mark Participant as no-show after the allowed check-in window.
• Participant receives notification and can respond.
• If Participant does not respond, reservation fee may be released to Host according to policy.
• Refundable deposit handling should follow cancellation/no-show rules.
• Admin can review if disputed.

B. Host does not open door / does not respond:
• Participant can open Emergency Housing Case.
• Participant receives priority re-housing support.
• Host does not receive the 20% reservation fee.
• Booking is flagged for Admin review.
• Host reliability score is reduced.
• Host may receive account strike or suspension.

C. Participant arrives and housing does not match listing:
• Participant can open Emergency Housing Case.
• Participant can upload photos/videos.
• Admin reviews listing accuracy.
• If claim is valid, Participant receives refund and priority re-housing support.
• Host may receive penalties.

Emergency case UI:
• “I arrived but cannot access housing”
• “Housing does not match listing”
• “Host is not responding”
• “Unsafe conditions”
• “Different price or hidden fee requested”

7. LISTING ACCURACY REPORTING

Add “Report Inaccurate Listing” flow.

Reasons:
• Wrong photos
• Wrong address
• Unsafe conditions
• Fewer beds than promised
• Different price
• Hidden fees
• Listing not available
• Misleading description
• Gender policy mismatch
• Other

Reports should go to Admin Dashboard.

Admin can:
• Review report.
• Contact host.
• Remove listing.
• Suspend listing.
• Warn host.
• Mark report resolved.

8. HIDDEN FEES BAN

Implement hidden fee prevention.

Host must disclose all required fees before booking.

Listing should show:
• Weekly rent
• Deposit amount
• Deposit breakdown
• Cleaning fee, if any
• Utilities fee, if any
• Other required fees
• Total due before move-in
• Weekly rent due after move-in

Host cannot demand additional off-platform fees after booking.

Add warning text:
“All required fees must be disclosed before booking. Do not pay off-platform.”

If Host asks for Zelle, cash, Venmo, Cash App, or any payment outside the platform, Participant can report it.

9. ADDRESS PRIVACY

Do not show exact address before booking confirmation.

Before booking:
• Show approximate area.
• Show map radius or neighborhood.
• Do not reveal street address or house number.

After deposit payment and booking confirmation:
• Show exact address.
• Show check-in instructions if provided.

Host and Admin can see the full listing address.
Participant can see full address only after confirmed booking.

10. EMERGENCY CONTACT FOR PARTICIPANTS

Add required emergency contact field for Participants.

Participant must provide:
• Emergency contact name
• Relationship
• Phone number
• Email, optional
• Country, optional

Privacy rule:
• Host can only see emergency contact after Participant has a confirmed booking with that Host.
• Employer can only see emergency contact if Participant is connected to that Employer.
• Other users cannot see emergency contact.
• Admin can see emergency contact only for safety/support reasons.

11. MESSAGING SAFETY

Add safety features to messaging.

Requirements:
• Report message.
• Block user.
• Warning if someone asks to pay outside the platform.
• Keep communication inside the app.
• Admin can review reported messages.
• Reported messages should create admin review items.

Add automatic warning keywords:
• Zelle
• Cash App
• Venmo
• cash
• wire transfer
• pay outside
• direct payment
• off platform

If detected, show a warning:
“Payments outside the platform are not protected.”

12. HOST VERIFICATION

Do NOT show multiple partial verification badges as if they equal verified.

Host has only one main status:
• Verified
• Not Verified

A Host becomes Verified only after completing the full verification process.

Full Host Verification requires:
• Email confirmation
• Phone confirmation
• Government ID
• Identity verification
• Property verification
• Proof of ownership or authorization to rent
• Listing/property review by Admin

UI:
• Show “Verified Host” only after full verification is approved.
• Otherwise show “Host Not Verified.”
• Email/phone confirmation may be stored internally, but should not be presented as full verification.

Admin must review and approve Host verification applications.

13. LISTING RULES AND PRICING

Add advanced listing rules.

Host can set:
• Minimum stay
• Maximum stay
• Weekly price
• Seasonal price changes
• Different price by date range
• Check-in date rules
• Check-out date rules
• Available dates
• Blocked dates
• Capacity
• Gender policy
• Listing type

Listing types:
• Entire place
• Private room
• Shared room
• Bed in shared room

Pricing display:
• Show weekly rent clearly.
• Show deposit clearly.
• Show all required fees clearly.
• Show total upfront amount before booking.

14. AVAILABILITY AND CAPACITY

Make availability capacity-based and date-based.

Requirements:
• Host can block/unblock dates.
• Confirmed bookings block capacity for selected dates.
• Shared room with 4 spots should allow 4 Participants to book the same date range.
• If 1 Participant books, show 3 spots left.
• When all spots are booked, dates become unavailable.
• Entire place and private room with capacity 1 become unavailable after one confirmed booking.
• Prevent overbooking.
• Availability must consider manual blocks, confirmed bookings, cancellations, and capacity.

15. ACCOUNT AND DATA DELETION

Add privacy/account controls.

Users must be able to:
• Delete account.
• Request data deletion.
• Contact support about privacy.
• View Privacy Policy.
• View Terms of Service.

If full deletion cannot happen immediately because of legal/payment/dispute records, show:
“Some records may be retained as required for legal, safety, payment, or dispute resolution purposes.”

16. DATABASE AND SECURITY

Update Supabase schema as needed.

Create/update tables for:
• admins
• admin_actions
• reports
• disputes/cases
• bookings
• booking_status_history
• deposits
• payments
• rent_payments
• checkin_proof
• checkout_proof
• listing_reports
• emergency_cases
• host_verification_requests
• availability_blocks
• pricing_rules
• emergency_contacts
• message_reports

Security:
• Enable Row Level Security.
• Participants can only see their own private records.
• Hosts can only see data related to their listings/bookings.
• Employers can only see connected Participant data.
• Admin can access moderation/support data.
• Emergency contact must not be public.
• Exact address must not be shown before confirmed booking.

17. FINAL TESTING

After implementation, test:

• Admin can log in separately.
• Admin can review disputes.
• Admin can review reports.
• Admin can block user.
• Admin can remove listing.
• Participant can book and pay deposit.
• Host can accept booking.
• Booking status updates correctly.
• Deposit release flow works.
• Host can open case within 3 days after check-out.
• Deposit auto-releases if host does not respond.
• Participant can upload proof.
• Host can upload proof.
• No-show case works.
• Emergency case works.
• Hidden fee report works.
• Address stays private until confirmed booking.
• Emergency contact visibility works correctly.
• Weekly rent/autopay structure works.
• Host verification requires full approval.
• Listing capacity prevents overbooking.
• Gender policy prevents ineligible bookings.
• Account deletion/request data deletion exists.

Important:
This app must remain mobile-first, clean, and production-ready. Do not simplify the platform. Keep Participant, Host, Employer, and Admin logic separate and secure.
