import React, { useState, useEffect, useContext } from "react";
import { deleteCalendarEvent, fetchCalendarEvents } from "../../hooks/supabase";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Modal,
} from "@mui/material";
import { EventsContext } from "../../context/EventsProvider";
import EventForm from "../EventForm";
import { ModalStyle } from "../../styles";

function CalendarList({ session }) {
  const { events, setEvents } = useContext(EventsContext);

  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const deleteEvent = async (eventId) => {
    deleteCalendarEvent(session, eventId).then(async () => {
      const updatedEvents = await fetchCalendarEvents(session);
      setEvents(updatedEvents);
    });
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const loadEvents = async () => {
      if (events.length === 0) {
        const fetchedEvents = await fetchCalendarEvents(session);
        setEvents(fetchedEvents);
      }
    };

    loadEvents();
  }, [session, setEvents, events.length]);

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, p: 2 }}>
        Google Calendar Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <React.Fragment key={event.id}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={event.summary}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(event.start.dateTime).toLocaleString()} -{" "}
                        {new Date(event.end.dateTime).toLocaleString()}
                      </Typography>
                      {" — " + event.description}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <div style={{ display: "flex", gap: "5px" }}>
                <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
                <Button onClick={() => openEditModal(event)}>Edit</Button>
              </div>
            </Box>
            {index < events.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-event-modal"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <EventForm session={session} closeForm={handleClose} currentEvent={currentEvent}/>
        </Box>
      </Modal>
    </Box>
  );
}

export default CalendarList;
