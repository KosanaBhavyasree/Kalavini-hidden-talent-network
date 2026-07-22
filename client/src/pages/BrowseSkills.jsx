import { useEffect, useState } from "react";
import { getAllSkills } from "../services/skillService";
import { useNavigate } from "react-router-dom";
import "./BrowseSkills.css";
import { useAuth } from "../context/AuthContext";
import { deleteSkill } from "../services/skillService";

function BrowseSkills() {
  const [search, setSearch] = useState("");
const [filteredSkills, setFilteredSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    loadSkills();
  }, []);
  useEffect(() => {
  const filtered = filteredSkills.filter((skill) =>
    skill.title.toLowerCase().includes(search.toLowerCase()) ||
    skill.category.toLowerCase().includes(search.toLowerCase())
  );

  setFilteredSkills(filtered);
}, [search, skills]);
const { user } = useAuth();

  const loadSkills = async () => {
    try {
      const res = await getAllSkills();
      
      setFilteredSkills(res.skills || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }
async function handleDelete(id) {
  if (!window.confirm("Delete this skill?")) return;

  try {
    await deleteSkill(id);
    loadSkills();
  } catch (err) {
    console.error(err);
  }
}
  return (
    <div className="browse-container">
      <h1>Browse Skills</h1>
      <input
  type="text"
  placeholder="🔍 Search skills..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-box"
/>

      <div className="skills-grid">
        {filteredSkills.map((skill) => (
          <div key={skill._id} className="skill-card">
            <h2>{skill.title}</h2>

            <p className="category">{skill.category}</p>

            <p>{skill.description}</p>

            <p>
              <strong>Teacher:</strong>{" "}
              {skill.teacher?.name}
            </p>

            <p>
              <strong>Difficulty:</strong>{" "}
              {skill.difficulty}
            </p>

            <p>⭐ {skill.averageRating.toFixed(1)}</p>

            <button onClick={() => navigate(`/skill/${skill._id}`)}>
              View Details
              {skill.teacher?._id === user?._id && (
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    <button
      className="edit-btn"
      onClick={() => navigate(`/edit-skill/${skill._id}`)}
    >
      ✏️ Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(skill._id)}
    >
      🗑 Delete
    </button>
  </div>
)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseSkills;