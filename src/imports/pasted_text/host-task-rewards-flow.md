Create a complete FRONT-END UX/UI flow for a Host Tasks & Rewards system inside active housing listings.

This task is about FRONT-END UX/UI if used in Figma, and about full implementation if used in Replit.

The goal:
Hosts can create paid tasks for Participants currently living in their listing.

Participants can:
• Accept tasks
• Complete tasks
• Upload proof
• Receive rewards
• Either cash out the reward or send it to a good cause

This system should feel:
• Helpful
• Community-oriented
• Organized
• Motivating
• Positive
• Not overly corporate or complicated

GENERAL CONCEPT

Hosts should be able to create tasks connected to their active listing.

Only Participants currently staying in that listing during those dates should receive the task.

Participants should receive:
• In-app notification
• Email notification

The task system should feel integrated but not overcrowded.

Do NOT create a huge separate complicated dashboard.

Instead:
• Add lightweight task widgets/cards
• Small task center
• Notification-based flow
• Clean mobile-first UI

HOST TASK CREATION FLOW

Create a “Create New Task” flow for Hosts.

Host should be able to:

• Create task title
• Select task category from dropdown
• Write task description
• Set reward amount
• Set deadline/date
• Add optional photos/videos
• Assign to:

* Anyone in listing
* Specific room
* Specific Participant
  • Submit task

TASK CATEGORIES

Dropdown menu examples:

• Kitchen cleaning
• Bathroom cleaning
• Trash/recycling
• Laundry room
• Yard/outdoor
• Grocery/help errand
• Move-in preparation
• Move-out preparation
• Deep cleaning
• Organizing common area
• Pet care
• Delivery/help request
• Maintenance help
• General house help
• Other/custom

If Host selects “Other,” allow custom category and description.

HOST TASK CARD

Host task card should show:

• Task title
• Category
• Reward amount
• Deadline
• Assigned scope
• Status
• Number of applicants/accepted
• Uploaded proof
• Task timeline

Task statuses:
• Open
• Accepted
• In progress
• Submitted for review
• Approved
• Rejected / revision requested
• Completed
• Expired

PARTICIPANT TASK FLOW

Participants living in the listing should receive:

• Push/in-app notification
• Email notification
• Task card inside app

Participant task UI should show:

• Task title
• Reward amount
• Description
• Deadline
• Host name
• Listing name
• Task category
• Optional photos/videos

Participant actions:
• Accept task
• Decline task
• Ask question
• Submit completion

TASK ACCEPTANCE RULES

If task is first-come-first-served:
• Once accepted, other Participants cannot accept it.

If Host allows multiple people:
• Show remaining slots.

TASK COMPLETION FLOW

Participant should be able to:

• Upload photos
• Upload videos
• Write comment/note
• Add optional before/after proof
• Submit task completion

Create:
• Upload proof UI
• Progress state
• Submitted confirmation
• Waiting for Host review state

HOST REVIEW FLOW

Host receives notification:
• “Task submitted for review”

Host can:
• Review uploaded proof
• Approve task
• Request revision
• Reject task with explanation

If Host requests revision:
• Participant receives notification
• Participant can resubmit proof

TASK PAYMENT FLOW

When task is approved:
• Reward amount is released

Participant receives:
• In-app notification
• Email notification

Message example:
“Your task has been approved. Your reward is ready.”

REWARD OPTIONS

Participant should have TWO options:

1. Cash out reward
2. Send reward to a good cause

Do NOT use cold wording like:
• Donation
• Charity only

Instead create warmer/community-oriented wording.

Suggested wording examples:
• “Support a good cause”
• “Give it forward”
• “Make an impact”
• “Help where it matters”
• “Share the reward”
• “Do something kind with it”

Create a beautiful positive UI around this flow.

GOOD CAUSE / CHARITY OPTIONS

Create selectable causes such as:

• Animal rescue & homeless dogs
• Animal shelters
• Emergency animal care
• Ocean/environment cleanup
• Tree planting/environment
• Student emergency support fund
• Food support/community kitchens
• Mental health support
• Disaster relief
• Local community support

Allow Admin to:
• Add/edit causes later

Participant should see:
• Cause name
• Small description
• Optional image/icon
• Select cause button

If Participant selects:
“Cash out reward”
→ Funds go to linked payment card/account.

If Participant selects:
“Support a good cause”
→ Reward is transferred to selected cause balance/fund placeholder.

PAYMENT ACCOUNT CONNECTION

Participants should be able to connect:
• Debit card
• Bank account
• Payment account placeholder

Create:
• Connect payout method
• Payout settings
• Reward balance
• Pending rewards
• Reward history

TASK CENTER

Create a lightweight Task Center.

Participant side:
• Available tasks
• Accepted tasks
• Submitted tasks
• Completed tasks
• Reward history

Host side:
• Active tasks
• Pending review
• Approved tasks
• Expired tasks
• Task history
• Total rewards paid

TASK NOTIFICATIONS

Create notification examples:

Participant:
• New task available
• Task accepted
• Deadline reminder
• Revision requested
• Task approved
• Reward available

Host:
• Task accepted
• Task submitted
• Revision completed
• Task expired

COMMUNITY FEEL

The system should NOT feel like exploitative cheap labor.

The UX should feel:
• Optional
• Helpful
• Collaborative
• Community-based
• Rewarding

Use positive language:
• “Help around the house”
• “Community tasks”
• “Earn rewards”
• “Make an impact”

Avoid:
• “Labor”
• “Worker”
• “Job assignment”

ADMIN TASK MODERATION

Create Admin-side screens for:

• Task reports
• Abuse reports
• Reward disputes
• Suspicious activity
• Charity/cause management
• Task moderation

Admin can:
• Review task disputes
• Refund reward
• Suspend abusive Host
• Suspend abusive Participant
• Add/remove causes
• Moderate inappropriate tasks

MOBILE-FIRST UX

Create mobile-first screens for:

• Task cards
• Notifications
• Upload proof
• Reward selection
• Charity selection
• Task center
• Host review flow

FINAL REQUIREMENT

Create actual visible screens and clickable front-end flows.

Do not only describe the logic.

The Tasks & Rewards system should feel like a modern community feature inside the housing ecosystem, encouraging responsibility, collaboration, and positive engagement.
