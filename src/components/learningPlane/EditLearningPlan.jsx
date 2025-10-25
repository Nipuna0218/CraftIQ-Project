import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// ---- helpers to prevent prototype-pollution / unsafe member access ----
const ALLOWED_FIELDS = new Set(["title", "date", "completed"]);
const MAX_TEXT_LEN = 200;

function sanitizeText(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LEN);
}

function inRange(i, arr) {
  return Number.isInteger(i) && i >= 0 && i < arr.length;
}
// ----------------------------------------------------------------------

function EditLearningPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [title, setTitle] = useState("");
  const [weeks, setWeeks] = useState([]);

  // Fetch the learning plan
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    axios
      .get(`http://localhost:8086/api/learningPlans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;

        const weekObjects = data.weeks.map((week, index) => ({
          week,
          milestones: data.milestones.slice(index * 3, index * 3 + 3) || [],
        }));

        setLearningPlan(data);
        setTitle(data.title);
        setWeeks(weekObjects);
      })
      .catch((err) => {
        console.error("Error fetching learning plan:", err);
      });
  }, [id]);

  const addMilestone = (weekIndex) => {
    if (!inRange(weekIndex, weeks)) return;
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex && w.milestones.length < 3
          ? {
              ...w,
              milestones: [
                ...w.milestones,
                { title: "", date: "", completed: false },
              ],
            }
          : w
      )
    );
  };

  const addWeek = () => {
    setWeeks((prev) => [
      ...prev,
      {
        week: `Week ${prev.length + 1}`,
        milestones: [{ title: "", date: "", completed: false }],
      },
    ]);
  };

  // ---- hardened: sanitize, bounds-check, immutable update ----
  const handleMilestoneChange = (weekIndex, milestoneIndex, field, value) => {
    if (!inRange(weekIndex, weeks)) return;
    if (!inRange(milestoneIndex, weeks[weekIndex].milestones)) return;
    if (!ALLOWED_FIELDS.has(field)) return; // block unexpected keys like __proto__

    const nextVal =
      field === "completed" ? value === "true" : sanitizeText(value);

    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi === weekIndex
          ? {
              ...w,
              milestones: w.milestones.map((m, mi) =>
                mi === milestoneIndex ? { ...m, [field]: nextVal } : m
              ),
            }
          : w
      )
    );
  };

  // ---- hardened: sanitize and immutable update (property name is constant) ----
  const handleWeekChange = (weekIndex, value) => {
    if (!inRange(weekIndex, weeks)) return;
    const safeValue = sanitizeText(value).slice(0, 50); // keep label short
    setWeeks((prev) =>
      prev.map((w, i) => (i === weekIndex ? { ...w, week: safeValue } : w))
    );
  };

  const handleSave = async () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const updatedMilestones = weeks.flatMap((w) => w.milestones);
    const updatedWeekStrings = weeks.map((w) => w.week);

    const updatedPlan = {
      ...learningPlan,
      title,
      weeks: updatedWeekStrings,
      milestones: updatedMilestones,
    };

    try {
      await axios.put(
        `http://localhost:8086/api/learningPlans/${id}`,
        updatedPlan,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Learning Plan updated successfully!",
        confirmButtonColor: "#3085d6",
      });

      navigate("/user/learning-plane");
    } catch (err) {
      console.error("Failed to update plan:", err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update the learning plan.",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (!learningPlan) return <p>Loading...</p>;

  return (
    <div className="container mb-50 mt-50">
      <div className="w-95 w-md-75 w-lg-60 w-xl-55 mx-auto mb-6 text-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(sanitizeText(e.target.value))}
          className="form-control mb-4 text-center"
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
                          type="text"
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
                          placeholder="Date or Description"
                        />
                        <select
                          className="form-control"
                          value={String(milestone.completed)}
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
        <button className="btn btn-second" onClick={handleSave}>
          Save Learning Plan
        </button>
      </div>
    </div>
  );
}

export default EditLearningPlan;
