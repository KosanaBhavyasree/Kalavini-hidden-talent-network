import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";


import { getMySkills } from "../services/skillService";
import { getRequests } from "../services/requestService";
import { getNotifications } from "../services/notificationService";
import { getMatches } from "../services/matchService";

import { useNavigate } from "react-router-dom";
import Avatar from "../components/dashboard/Avatar";
import Loader from "../components/dashboard/Loader";

import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [skillsRes, requestsRes, notificationsRes, matchesRes] =
        await Promise.all([
          getMySkills(),
          getRequests(),
          getNotifications(),
          getMatches(),
        ]);

      setSkills(skillsRes.skills || []);
      setRequests(requestsRes.requests || []);
      setNotifications(notificationsRes.notifications || []);
      setMatches(matchesRes.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

 if (loading) return <Loader />;

console.log(matches);



  

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div className="welcome">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Teach • Learn • Grow Together</p>
        </div>


        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

          <button
            className="logout-btn"
            onClick={() => navigate("/profile")}
          >
            👤 Profile
          </button>

          <button
            className="logout-btn"
            onClick={() => navigate("/browse-skills")}
          >
            📚 Browse Skills
          </button>
          <button
  className="logout-btn"
  onClick={() => navigate("/requests")}
>
  📩 Requests
</button>

          <button
            className="logout-btn"
            onClick={() => navigate("/add-skill")}
          >
            ➕ Add Skill
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      <div className="profile-card">

        <Avatar
          name={user?.name}
          image={user?.profilePicture}
          size={90}
        />

        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.bio || "No bio added yet."}</p>
          <p>📍 {user?.location || "Unknown"}</p>
          <p>🕒 {user?.availability || "Not specified"}</p>
        </div>

      </div>

      <div className="stats-grid">

        <div className="dashboard-card">
          <h3>Skills</h3>
          <h1>{skills.length}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Requests</h3>
          <h1>{requests.length}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Matches</h3>
          <h1>{matches.length}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Notifications</h3>
          <h1>{notifications.length}</h1>
        </div>

      </div>

      <div className="two-column">

        <div className="dashboard-card">

          <h3>My Skills</h3>

          {skills.length === 0 ? (

            <div className="empty">
              No skills added yet.
            </div>

          ) : (

            <div className="skill-list">

              {skills.map((skill) => (

                <div key={skill._id} className="skill-chip">
                  {skill.title}
                </div>

              ))}

            </div>

          )}

        </div>

        <div className="dashboard-card">

          <h3>Recommended Matches</h3>

          {matches.length === 0 ? (

            <div className="empty">
              No matches found.
            </div>

          ) : (

            <div className="section-list">

              {matches.slice(0,5).map((match) => (

                <div key={match.user._id} className="list-item match-item">

                  <div>
                    <strong>{match.user.name}</strong>
                    <br/>
                    {match.user.location}
                  </div>

                  <div className="match-percent">
                    {match.matchPercent}%
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <div className="two-column">

        <div className="dashboard-card">

          <h3>Recent Requests</h3>

          {requests.length === 0 ? (

            <div className="empty">
              No requests.
            </div>

          ) : (

            <div className="section-list">

              {requests.slice(0,5).map((request) => (

                <div key={request._id} className="list-item">

                  <strong>{request.skill?.title}</strong>

                  <br/>

                  Status : {request.status}

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="dashboard-card">

          <h3>Notifications</h3>

          {notifications.length === 0 ? (

            <div className="empty">
              No notifications.
            </div>

          ) : (

            <div className="section-list">

              {notifications.slice(0,5).map((notification) => (

                <div key={notification._id} className="list-item">

                  {notification.message}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;