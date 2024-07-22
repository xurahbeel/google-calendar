import "./App.css";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import { googleSignIn, signOut } from "./hooks/supabase";
import EventForm from "./components/EventForm";
import { Button, Typography } from "@mui/material";
import CalendarList from "./components/CalendarList";
import { Modal, Box } from "@mui/material";
import { useState } from "react";
import { ModalStyle } from "./styles";

function App() {
  const session = useSession();
  const { isLoading } = useSessionContext();

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false)
    
  };

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="App">
      <div>
        {session ? (
          <>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Hey{" "}
                {`${
                  session?.user.identities?.[0]?.identity_data?.full_name ?? ""
                } (${session.user.email})`}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Create Event
              </Button>
            </Box>
            <div
              style={{
                width: "80%",
                margin: "auto",
                height: "70vh",
                overflowY: "scroll",
              }}
            >
              <CalendarList session={session} />
            </div>
            <Button
              style={{ width: "200px" }}
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => googleSignIn()}
              style={{ marginTop: "10%" }}
            >
              Google Sign In
            </Button>
          </>
        )}
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <EventForm session={session} closeForm={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}

export default App;
