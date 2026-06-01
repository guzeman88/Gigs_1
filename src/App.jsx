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
      <div className="flex flex-col min-h-[100dvh] bg-slate-50 max-w-2xl mx-auto relative">
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
