import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ListView from "./components/ListView";
import CalendarView from "./components/CalendarView";
import { useEvents } from "./hooks/useEvents";

export default function App() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <BrowserRouter>
      <div style={{
        maxWidth: 640,
        margin: "0 auto",
        minHeight: "100dvh",
        position: "relative",
        background: "#f1f5f9",
      }}>
        <Routes>
          <Route
            path="/"
            element={
              <ListView
                events={events}
                addEvent={addEvent}
                updateEvent={updateEvent}
                deleteEvent={deleteEvent}
              />
            }
          />
          <Route
            path="/calendar"
            element={<CalendarView events={events} />}
          />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}
