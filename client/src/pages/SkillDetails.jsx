import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { sendRequest } from "../services/requestService";
import api from "../services/api";
import "./SkillDetails.css";

function SkillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);

  useEffect(() => {
    loadSkill();
  }, []);

  async function loadSkill() {
    try {
      const res = await api.get(`/skills/${id}`);
      setSkill(res.data.skill);
    } catch (err) {
      console.error(err);
    }
  }

  if (!skill) {
    return <h2 style={{ padding: 40 }}>Loading...</h2>;
  }
  async function handleRequest() {
  try {
    await sendRequest({
      skillId: skill._id,
    });

    alert("Request sent successfully!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Unable to send request");
  }
}
 
  return (
    <div className="skill-details-container">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="skill-details-card">

        <h1>{skill.title}</h1>

        <h3>{skill.category}</h3>

        <p>
          <strong>Teacher:</strong>{" "}
          {skill.teacher?.name}
        </p>

        <p>
          <strong>Difficulty:</strong>{" "}
          {skill.difficulty}
        </p>

        <p>
          <strong>Availability:</strong>{" "}
          {skill.availability || "Not specified"}
        </p>

        <p>
          <strong>Desired Skill Exchange:</strong>{" "}
          {skill.desiredSkillExchange || "None"}
        </p>

        <p>
          <strong>Rating:</strong>{" "}
          ⭐ {(skill.averageRating ?? 0).toFixed(1)}
        </p>

        <hr />

        <h3>Description</h3>

        <p>{skill.description}</p>
       <button
  className="request-btn"
  onClick={handleRequest}
>
  📩 Send Request
</button>
  

      </div>

    </div>
  );
}

export default SkillDetails;