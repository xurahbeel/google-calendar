import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import {
  createCalendarEvent,
  fetchCalendarEvents,
  updateCalendarEvent,
} from "../../hooks/supabase";
import { EventsContext } from "../../context/EventsProvider";

function EventForm({ session, closeForm, currentEvent }) {
  const { setEvents } = useContext(EventsContext);

  const [eventDetails, setEventDetails] = useState(
    currentEvent
      ? {
          start: new Date(),
          end: new Date(),
          eventName: currentEvent.summary,
          eventDescription: currentEvent.description,
        }
      : {
          start: new Date(),
          end: new Date(),
          eventName: "",
          eventDescription: "",
        }
  );

  const _create = () => {
    if (currentEvent) {
      updateCalendarEvent(session, currentEvent.id, eventDetails).then(
        async () => {
          closeForm();
          const fetchedEvents = await fetchCalendarEvents(session);
          setEvents(fetchedEvents);
        }
      );
      return;
    }
    createCalendarEvent(session, eventDetails).then(async () => {
      closeForm();
      const fetchedEvents = await fetchCalendarEvents(session);
      setEvents(fetchedEvents);
    });
  };

  const handleInputChange = (e) => {
    const { name: key, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (currentEvent) {
      setEventDetails({
        start: new Date(currentEvent.start.dateTime),
        end: new Date(currentEvent.end.dateTime),
        eventName: currentEvent.summary,
        eventDescription: currentEvent.description,
      });
    }
  }, [currentEvent]);

  return (
    <Container
      maxWidth="sm"
      style={{ border: "2px solid black", borderRadius: "5px" }}
    >
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          label="Event Name"
          variant="outlined"
          margin="normal"
          onChange={handleInputChange}
          value={eventDetails.eventName}
          name="eventName"
        />
        <TextField
          fullWidth
          name="eventDescription"
          label="Event description"
          variant="outlined"
          margin="normal"
          value={eventDetails.eventDescription}
          onChange={handleInputChange}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={_create}
        >
          {currentEvent ? "Update" : "Create"} Calendar Event
        </Button>
      </Box>
    </Container>
  );
}

export default EventForm;
