import React from "react";

function Avatar({ user, size = 90 }) {
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#5A189A,#9D4EDD)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: size / 2.5,
        border: "3px solid #E8A317",
      }}
    >
      {initials}
    </div>
  );
}

export default Avatar;