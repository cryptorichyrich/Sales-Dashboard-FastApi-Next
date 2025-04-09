import { useState, useEffect } from "react";

export default function Home() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setSalesReps(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    // Add user message to chat
    const userMessage = {
      type: "user",
      text: question,
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Changed from 'question' to match backend expectation
          question: question,
        }),
      });
      const data = await response.json();

      // Add AI response to chat
      const aiMessage = {
        type: "ai",
        text: data.answer || data.response,
      };
      setChatMessages((prev) => [...prev, aiMessage]);

      // Clear input after sending
      setQuestion("");
    } catch (error) {
      console.error("Error in AI request:", error);

      // Add error message to chat
      const errorMessage = {
        type: "ai",
        text: "Sorry, there was an error processing your request.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Get unique regions
  const regions = [...new Set(salesReps.map((rep) => rep.region))];

  // Filter sales reps by region
  const filteredSalesReps = selectedRegion
    ? salesReps.filter((rep) => rep.region === selectedRegion)
    : salesReps;

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "2rem",
        }}
      >
        Sales Dashboard
      </h1>

      {/* Sales Representatives Section */}
      <section style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Sales Representatives</h2>
          <div>
            <label htmlFor="region-select" style={{ marginRight: "0.5rem" }}>
              Filter by Region:
            </label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ padding: "0.5rem" }}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading sales representatives...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredSalesReps.map((rep) => (
              <div
                key={rep.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#f9f9f9",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>
                  {rep.name}
                </h3>
                <p style={{ margin: "0 0 0.5rem 0", color: "#7f8c8d" }}>
                  {rep.role} | {rep.region}
                </p>
                <div
                  style={{
                    backgroundColor: "#ecf0f1",
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Skills:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.25rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {rep.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          backgroundColor: "#3498db",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>Deals:</strong>
                  {rep.deals.map((deal, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "0.25rem",
                        padding: "0.25rem",
                        backgroundColor: "#e8f4f8",
                        borderRadius: "4px",
                      }}
                    >
                      <span>{deal.client}</span>
                      <span
                        style={{
                          color:
                            deal.status === "Closed Won"
                              ? "#2ecc71"
                              : deal.status === "In Progress"
                              ? "#f39c12"
                              : "#e74c3c",
                        }}
                      >
                        {deal.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Chat Section */}
      <section
        style={{
          backgroundColor: "#f1f1f1",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h2>Ask About Sales</h2>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ddd",
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "white",
          }}
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              style={{
                textAlign: message.type === "user" ? "right" : "left",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  backgroundColor:
                    message.type === "user" ? "#3498db" : "#ecf0f1",
                  color: message.type === "user" ? "white" : "black",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  display: "inline-block",
                  maxWidth: "70%",
                }}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Ask a question about sales..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            style={{
              flexGrow: 1,
              padding: "0.5rem",
              marginRight: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleAskQuestion}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Ask
          </button>
        </div>
      </section>
    </div>
  );
}
