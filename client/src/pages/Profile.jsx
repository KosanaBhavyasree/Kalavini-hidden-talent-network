import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    availability: user?.availability || "",
    skillsToTeach: (user?.skillsToTeach || []).join(", "),
    skillsToLearn: (user?.skillsToLearn || []).join(", "),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        skillsToTeach: formData.skillsToTeach
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        skillsToLearn: formData.skillsToLearn
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await updateProfile(payload);

      updateUser(res.user);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h1>My Profile</h1>

        <form onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            rows="4"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>Availability</label>
          <input
            name="availability"
            value={formData.availability}
            onChange={handleChange}
          />

          <label>Skills I Can Teach</label>
          <input
            name="skillsToTeach"
            placeholder="Python, React, Java"
            value={formData.skillsToTeach}
            onChange={handleChange}
          />

          <label>Skills I Want To Learn</label>
          <input
            name="skillsToLearn"
            placeholder="UI Design, Photoshop"
            value={formData.skillsToLearn}
            onChange={handleChange}
          />

          <button
            className="save-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Profile;