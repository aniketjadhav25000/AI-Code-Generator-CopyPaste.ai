import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    apiGet("/user/profile").then(setProfile);
  }, []);

  const updatePreferences = async () => {
    const updated = await apiPost("/user/settings", { preferences: { theme: preferences } });
    alert("Updated preferences: " + JSON.stringify(updated.preferences));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl">Profile</h2>
      <p><b>Email:</b> {profile.email}</p>
      <input className="border p-2 mt-4" value={preferences} onChange={e => setPreferences(e.target.value)} placeholder="Update theme or preference" />
      <button onClick={updatePreferences} className="ml-2 bg-blue-600 text-white p-2">Update</button>
    </div>
  );
}
