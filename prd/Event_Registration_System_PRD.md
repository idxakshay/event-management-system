# Product Requirements Document
## Event Registration System

---

## 1. Product Overview

### 1.1 Purpose
A system that allows organizers to create and manage events, and enables users to discover and register for these events with automated capacity management.

### 1.2 User Roles

**Admin Users (Event Organizers)**
- Can create events
- Can modify their events
- Can cancel their events
- Can view who registered for their events

**Regular Users (Attendees)**
- Can sign up to the platform
- Can browse available events
- Can register for events
- Can cancel their registrations
- Can view their own registrations

---

## 2. Core Functions

### 2.1 User Management

#### Sign Up
Users can create an account by providing:
- Full Name
- Email Address
- Phone Number (optional)

**Validation Rules:**
- Name must be between 2-100 characters
- Email must be valid and unique (no two users can have same email)
- Phone number must contain only digits (10-15 digits) if provided

---

### 2.2 Event Management

#### Create Event
Admin users can create events by specifying:
- **Event Name**: What the event is called
- **Description**: Detailed information about the event (optional)
- **Start Date & Time**: When the event begins
- **End Date & Time**: When the event ends
- **Event Type**: Must be one of - Webinar, Workshop, or Talk
- **Location/Place**: Where the event happens (can be physical address or online meeting link)
- **Maximum Audience**: How many people can attend

**Validation Rules:**
- Event name must be 5-200 characters
- Description cannot exceed 2000 characters
- Start time must be in the future (cannot create events for past dates)
- End time must be after start time
- Event type must be selected from the three options only
- Location must be provided (3-200 characters)
- Maximum audience must be at least 1 person and cannot exceed 10,000

#### View Events
Anyone can browse events with the ability to filter by:
- Event type (Webinar/Workshop/Talk)
- Event status (Upcoming/Ongoing/Completed/Cancelled)
- Date range

Each event listing shows:
- Event name and type
- Start and end time
- Location
- How many seats are available
- How many people have registered

#### View Event Details
Users can see complete information about any event including:
- All event details
- Number of confirmed attendees
- Number of people on waitlist (if event is full)

#### Modify Event
Admin users can update their event details with the following rules:
- Cannot modify events that have already ended
- Cannot change start time to a past date
- If reducing maximum audience, the new capacity must not be less than current confirmed registrations
- If increasing maximum audience, people from waitlist are automatically promoted to confirmed (oldest waitlist requests first)

#### Cancel Event
Admin users can cancel their events with these rules:
- Cannot cancel events that have already ended
- When event is cancelled, all registrations for that event are automatically cancelled
- System tracks how many registrations were cancelled

---

### 2.3 Registration Management

#### Register for Event
Regular users can register for events with the following behavior:

**When Event Has Available Seats:**
- User is immediately confirmed for the event
- Available seat count decreases by 1
- User receives confirmation

**When Event is Full:**
- User is automatically added to waitlist
- User is informed they are on waitlist
- Available seat count remains 0

**Registration Rules:**
- Can only register for events with "Upcoming" status
- Cannot register for ongoing, completed, or cancelled events
- Cannot register for events that have already started or ended
- One person can only register once per event (duplicate registrations not allowed)

#### Cancel Registration
Users can cancel their registration with the following behavior:

**If User Had Confirmed Registration:**
- Registration is cancelled
- Available seat count increases by 1
- The oldest person on the waitlist is automatically promoted to confirmed
- The promoted person is informed of their confirmation

**If User Was on Waitlist:**
- Registration is simply cancelled
- No change to available seats

**Cancellation Rules:**
- Cannot cancel a registration that is already cancelled
- Can cancel registration anytime before event ends

#### View My Registrations
Users can see all their registrations showing:
- Event details
- Registration status (Confirmed/Waitlisted/Cancelled)
- When they registered

Can filter to see only:
- Confirmed registrations
- Waitlisted registrations
- Cancelled registrations

#### View Event Registrations
Admin users can see who registered for their events showing:
- Total confirmed attendees
- Total waitlisted people
- Total cancelled registrations
- Participant details (name, email)

Can filter to see:
- Only confirmed attendees
- Only waitlisted people
- Only cancelled registrations

---

## 3. Event Status

Events automatically transition through statuses based on date and time:

- **Upcoming**: Current time is before event start time
- **Ongoing**: Current time is between start time and end time
- **Completed**: Current time is after event end time
- **Cancelled**: Manually cancelled by admin user

---

## 4. Key Business Rules

### 4.1 Capacity Management
- Available Seats = Maximum Audience - Confirmed Registrations
- When available seats = 0, new registrations go to waitlist
- Waitlist has no limit

### 4.2 Automatic Waitlist Promotion
- When a confirmed registration is cancelled, system automatically:
  - Finds the oldest waitlist request
  - Promotes them to confirmed
  - Maintains seat count accuracy

### 4.3 Event Capacity Changes
- Can increase capacity anytime (auto-promotes waitlisted users)
- Can decrease capacity only if new capacity ≥ current confirmed count

### 4.4 Event Lifecycle
- Events progress from Upcoming → Ongoing → Completed automatically
- Completed events cannot be modified
- Can only register for Upcoming events

### 4.5 Data Uniqueness
- Each email can only be used once for user signup
- Each user can only register once per event

---

## 5. Constraints & Limitations

### 5.1 Capacity Limits
- Minimum event capacity: 1 person
- Maximum event capacity: 10,000 people
- No limit on waitlist size

### 5.2 Time Constraints
- Events can only be created for future dates
- Cannot move event start time to the past
- End time must always be after start time

### 5.3 Registration Constraints
- Registration closes when event starts (even if seats available)
- Cannot register for cancelled events
- Cannot register twice for same event

---

## 6. User Experience Scenarios

### Scenario 1: Successful Registration
1. User browses upcoming workshops
2. Finds "AI Testing Workshop" with 5 seats available
3. Registers successfully
4. Receives confirmation
5. Available seats now show 4

### Scenario 2: Waitlist Registration
1. User wants to join "Cloud Security Talk"
2. Event shows 0 seats available
3. User registers anyway
4. System adds them to waitlist
5. User sees "Waitlisted" status
6. Another attendee cancels
7. System automatically promotes user from waitlist
8. User status changes to "Confirmed"

### Scenario 3: Event Capacity Increase
1. Admin creates workshop with 30 seats
2. Event fills up (30 confirmed)
3. 10 more people join waitlist
4. Admin increases capacity to 50
5. System automatically confirms oldest 20 from waitlist
6. Now: 50 confirmed, 0 waitlisted, 20 seats available

### Scenario 4: Event Cancellation
1. Admin cancels "Database Design Talk"
2. Event had 25 confirmed registrations and 5 waitlisted
3. System cancels all 30 registrations automatically
4. Event status changes to "Cancelled"
5. No new registrations accepted

---

## 7. Success Metrics

### For Event Organizers
- Successfully create and manage events
- Track registration numbers accurately
- Manage capacity effectively
- Understand attendance patterns

### For Attendees
- Easily discover relevant events
- Simple registration process
- Clear understanding of registration status
- Automatic waitlist management without manual intervention

---

## 8. Out of Scope

This version does NOT include:
- Payment or ticketing
- Email notifications
- Event reminders
- Check-in functionality
- Event reviews or ratings
- Social sharing
- Calendar integration
- Mobile app
- Event categories or tags
- Advanced search
- User profiles beyond basic info
- Event recommendations
