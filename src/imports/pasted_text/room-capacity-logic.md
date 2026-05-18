Create or update the Host listing creation and listing management flow with detailed room-level capacity logic.

This task is about FRONT-END UX/UI if used in Figma, and about full implementation if used in Replit.

The current simple “total capacity” logic is NOT enough.

HOST LISTING STRUCTURE

When a Host creates a listing, they must be able to describe the property in detail:

• Property type:

* Entire house
* Apartment
* Private room
* Shared room
* Bed in shared room
* Multiple rooms in one property

• Number of rooms available for booking

For each room, Host must be able to enter:

• Room name / label
Example: Room 1, Room A, Girls Room, Boys Room

• Room type:

* Private room
* Shared room
* Bed in shared room

• Number of beds / spots in this specific room

• Gender policy for this specific room:

* Female only
* Male only
* Mixed / any gender

Important:
Gender policy must be room-level, not only listing-level.

Example:
A house has 2 shared rooms:
• Room 1: 4 female-only spots
• Room 2: 4 male-only spots

The app must NOT treat this as 8 mixed spots.
The app must NOT allow 5 women and 3 men if the female room only has 4 spots.
The app must NOT allow a man to book a female-only room.
The app must NOT allow a woman to book a male-only room.

Participants must see:
• Number of rooms
• Number of spots in each room
• Room gender policy
• How many spots are still available in each room for selected dates
• Whether the room is female-only, male-only, or mixed
• Whether bathrooms are shared or private

ROOM-LEVEL AVAILABILITY

Availability must be calculated by room and by date.

If a shared room has 4 spots:
• 1 Participant books 1 spot → 3 spots remain available
• 2 Participants book → 2 spots remain
• 3 Participants book → 1 spot remains
• 4 Participants book → room becomes unavailable for those dates

The listing should only be fully unavailable when all eligible rooms/spots are fully booked or manually blocked.

Do NOT block the entire listing when only one bed/spot is booked in a shared room.

PARTICIPANT BOOKING FLOW

When Participant selects dates, the app should show room-level availability.

Participant should be able to choose:
• Room
• Bed/spot
• Dates

The booking button should only be enabled if:
• Selected dates are available
• There is remaining capacity in that room
• Participant gender matches the room policy
• Participant profile gender is completed if required

If Participant gender is missing, show:
“Complete your profile to check room eligibility.”

If room is female only and participant is male, show:
“This room is female only.”

If room is male only and participant is female, show:
“This room is male only.”

BATHROOM / TOILET INFORMATION

Host must be able to enter bathroom information.

For each bathroom, Host should be able to specify:

• Bathroom type:

* Private bathroom
* Shared bathroom

• Who uses it:

* Female only
* Male only
* Mixed / shared by all genders

• Which room(s) use this bathroom

• Number of people sharing this bathroom

Participants must see clearly:
• How many bathrooms are in the property
• Whether bathroom is private or shared
• Whether bathroom is shared with men, women, or mixed
• How many people share the bathroom
• Which rooms use the bathroom

HOST DATE BLOCKING

Host must be able to manually block dates for a listing, room, or specific spots if those dates do not already have active bookings.

Host can block dates for reasons such as:
• Personal use
• Maintenance
• Private booking
• Cleaning / preparation
• Not available
• Other

Use a dropdown menu for the reason.

Important rules:
• Host has the right to block available dates.
• Host cannot block dates that already have active confirmed bookings unless they go through a cancellation flow.
• If dates are free, Host can block them.
• Blocked dates cannot be booked by Participants.
• Host can later unblock dates.

HOST LISTING MANAGEMENT UI

Create Host-side screens for:

• Add property details
• Add rooms
• Add room capacity
• Add room gender policy
• Add bathroom details
• Add bathroom sharing rules
• Manage room availability
• Block/unblock dates
• View bookings by room
• View available spots by room
• Edit room details
• Edit bathroom details

PARTICIPANT LISTING DETAILS UI

Create Participant-side listing details that show:

• Property overview
• Rooms available
• Room cards
• Spots left per room
• Gender policy per room
• Bathroom sharing information
• Price per week
• Deposit
• Fees
• Available dates
• Blocked dates
• Book this room / spot button

Example room card:

Room 1
Female only
4 beds total
2 spots left for selected dates
Shared bathroom with Room 1 only
Bathroom shared by 4 women

Room 2
Male only
4 beds total
3 spots left for selected dates
Shared bathroom with Room 2 only
Bathroom shared by 4 men

DATABASE / LOGIC NOTES FOR IMPLEMENTATION

If implementing in Replit, create or update database structure for:

• properties
• rooms
• room_capacity
• room_gender_policy
• beds_or_spots
• bathrooms
• bathroom_room_assignments
• availability_blocks
• bookings
• booking_room_assignments

Booking logic must be room-level and date-based.

Prevent:
• Overbooking
• Wrong gender booking
• Booking blocked dates
• Blocking dates with active bookings
• Treating multi-room housing as one mixed capacity pool

FINAL REQUIREMENT

This is critical marketplace logic. Do not use one simple total capacity number for the entire listing when the property has multiple rooms.

Capacity, gender policy, bathroom sharing, and availability must be managed at the room level.
