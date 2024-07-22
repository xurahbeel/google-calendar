import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export async function googleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar",
    },
  });
  if (error) {
    alert("Error logging in to Google provider with Supabase");
    console.log(error);
  }
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function createCalendarEvent(session, eventDetails) {
  const { eventName, eventDescription, start, end } = eventDetails;
  const event = {
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
  await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
      alert("Event created, check your Google Calendar!");
    });
}

export async function fetchCalendarEvents(session) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
    }
  );
  if (!response.ok) {
    console.error("Failed to fetch calendar events");
    return [];
  }
  const data = await response.json();
  const events = data.items || [];
  // Sort events by latest date
  events.sort(
    (a, b) => new Date(b.start.dateTime) - new Date(a.start.dateTime)
  );
  return events;
}

export async function updateCalendarEvent(session, eventId, eventDetails) {
  const { eventName, eventDescription, start, end } = eventDetails;
  const event = {
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      alert("Event updated successfully!");
    })
    .catch((error) => console.error("Error updating event:", error));
}

export async function deleteCalendarEvent(session, eventId) {
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      alert("Event deleted successfully!");
    })
    .catch((error) => console.error("Error deleting event:", error));
}
