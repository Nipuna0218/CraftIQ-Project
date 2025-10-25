import React, { useState } from "react";
import Swal from "sweetalert2";
function AddLearningPlan() {
  const [title, setTitle] = useState("");
  const [weeks, setWeeks] = useState([]);

  const addWeek = () => {
    setWeeks([
      ...weeks,
      {
        week: `Week ${weeks.length + 1}`,
        milestones: [
          {
            title: "",
            date: "",
            completed: false,
          },
        ],
      },
    ]);
  };

  const addMilestone = (weekIndex) => {
    const updatedWeeks = [...weeks];
    if (updatedWeeks[weekIndex].milestones.length < 3) {
      updatedWeeks[weekIndex].milestones.push({
        title: "",
        date: "",
        completed: false,
      });
      setWeeks(updatedWeeks);
    }
  };

  const handleMilestoneChange = (weekIndex, milestoneIndex, field, value) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].milestones[milestoneIndex][field] =
      field === "completed" ? value === "true" : value;
    setWeeks(updatedWeeks);
  };

  const handleWeekChange = (weekIndex, value) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].week = value;
    setWeeks(updatedWeeks);
  };


const handleSave = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) {
    Swal.fire({
      icon: "warning",
      title: "User Not Logged In",
      text: "Please log in to create a learning plan.",
    });
    return;
  }

  const flatWeeks = weeks.map((w) => w.week);
  const flatMilestones = weeks.flatMap((w) => w.milestones);

  const newPlan = {
    title,
    description: "Default description here", // make this dynamic if needed
    status: "Active",
    userId: userId,
    weeks: flatWeeks,
    milestones: flatMilestones,
  };

  console.log("New Learning Plan:", newPlan);
 const token = JSON.parse(localStorage.getItem("user"))?.token;

try {
  const response = await fetch("http://localhost:8086/api/learningPlans/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`  // <-- Add this header
    },
    body: JSON.stringify(newPlan),
  });

  if (!response.ok) throw new Error("Failed to create learning plan");

  const data = await response.json();
  console.log("Created Plan:", data);

  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Learning Plan Created Successfully!",
  });

  // Optional: clear form or redirect user
} catch (error) {
  console.error("Error creating plan:", error);
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Something went wrong while creating the learning plan.",
  });
}

};


  return (
    <div className="container mb-50 mt-50">
      <div className="w-95 w-md-75 w-lg-60 w-xl-55 mx-auto mb-4 text-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-4 text-center"
          placeholder="Learning Plan Title"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        />
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="schedule-table">
            <table className="table bg-white">
              <tbody>
                {weeks.map((weekObj, weekIndex) => (
                  <tr key={weekIndex}>
                    <td className="day" style={{ minWidth: "150px" }}>
                      <input
                        type="text"
                        value={weekObj.week}
                        onChange={(e) =>
                          handleWeekChange(weekIndex, e.target.value)
                        }
                        className="form-control mb-2"
                      />
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => addMilestone(weekIndex)}
                        disabled={weekObj.milestones.length >= 3}
                      >
                        + Milestone
                      </button>
                    </td>

                    {weekObj.milestones.map((milestone, i) => (
                      <td className="active" key={i}>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) =>
                            handleMilestoneChange(
                              weekIndex,
                              i,
                              "title",
                              e.target.value
                            )
                          }
                          className="form-control mb-2"
                          placeholder="Milestone Title"
                        />
                        <input
                          type="date"
                          value={milestone.date}
                          onChange={(e) =>
                            handleMilestoneChange(
                              weekIndex,
                              i,
                              "date",
                              e.target.value
                            )
                          }
                          className="form-control mb-2"
                        />
                        <select
                          className="form-control"
                          value={milestone.completed}
                          onChange={(e) =>
                            handleMilestoneChange(
                              weekIndex,
                              i,
                              "completed",
                              e.target.value
                            )
                          }
                        >
                          <option value="false">Incomplete</option>
                          <option value="true">Completed</option>
                        </select>
                      </td>
                    ))}

                    {/* Fill remaining cells if < 3 milestones */}
                    {weekObj.milestones.length < 3 &&
                      [...Array(3 - weekObj.milestones.length)].map((_, i) => (
                        <td key={`empty-${i}`} />
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={addWeek}>
              + Add Week
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success" onClick={handleSave}>
          Save Learning Plan
        </button>
      </div>
    </div>
  );
}

export default AddLearningPlan;
