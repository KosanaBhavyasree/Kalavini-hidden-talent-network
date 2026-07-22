import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSkill } from "../services/skillService";

function AddSkill() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    availability: "",
    desiredSkillExchange: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createSkill(formData);

      alert("Skill added successfully!");

      navigate("/dashboard", {
  state: {
    refresh: true,
  },
});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <h1>Add Skill</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Skill Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="5"
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <input
          name="availability"
          placeholder="Availability"
          value={formData.availability}
          onChange={handleChange}
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <input
          name="desiredSkillExchange"
          placeholder="Desired Skill Exchange"
          value={formData.desiredSkillExchange}
          onChange={handleChange}
          style={{ width: "100%", padding: 12, marginBottom: 20 }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Skill"}
        </button>

      </form>
    </div>
  );
}

export default AddSkill;