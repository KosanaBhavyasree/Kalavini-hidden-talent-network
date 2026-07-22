import { useEffect, useState } from "react";
import {
  getRequests,
  updateRequestStatus,
} from "../services/requestService";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
  try {
    const res = await getRequests("received");
    setRequests(res.requests);
  } catch (err) {
    console.error(err);
  }
}
  async function handleStatus(id, status) {
    try {
      await updateRequestStatus(id, status);

      alert(`Request ${status}`);

      loadRequests();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Incoming Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>{request.skill?.title}</h3>

            <p>
              <strong>From:</strong>{" "}
              {request.sender?.name}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status}
            </p>

            {request.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    handleStatus(request._id, "accepted")
                  }
                >
                  ✅ Accept
                </button>

                <button
                  onClick={() =>
                    handleStatus(request._id, "rejected")
                  }
                  style={{ marginLeft: 10 }}
                >
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Requests;