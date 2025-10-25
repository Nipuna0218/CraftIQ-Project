import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LearningPlaneCard from "../components/learningPlane/LearningPlaneCard"; 
import Swal from "sweetalert2";

function LearningPlane() {
  const [learningPlans, setLearningPlans] = useState([]);
  const navigate = useNavigate();
const token = JSON.parse(localStorage.getItem("user"))?.token;

useEffect(() => {
  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/learningPlans/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch learning plans");

      const allPlans = await response.json();
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      // Filter for current user's plans
      const userPlans = allPlans.filter(plan => plan.userId === userId);

      // Convert API format into structure expected by <LearningPlaneCard />
      const structuredPlans = userPlans.map(plan => {
        const weeks = plan.weeks.map((week, index) => {
          // group 3 milestones per week (or fewer if not enough)
          const weekMilestones = plan.milestones.slice(index * 3, (index + 1) * 3);
          return {
            week,
            milestones: weekMilestones
          };
        });

        return {
          id: plan.id,
          title: plan.title,
          description: plan.description,
          weeks,
          deadline: plan.deadline || null
        };
      });

      setLearningPlans(structuredPlans);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not load learning plans.",
      });
    }
  };

  fetchPlans();
}, [token]);

const handleDelete = async (planId) => {
  try {
    const response = await fetch(`http://localhost:8086/api/learningPlans/${planId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Delete failed");

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Learning Plan has been deleted.",
    });

    setLearningPlans(prev => prev.filter(plan => plan.id !== planId));
  } catch (err) {
    console.error("Delete error:", err);
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: "Could not delete the learning plan.",
    });
  }
};


  return (
    <div>
      <button className="btn btn-primary mt-40 ml-10" onClick={() => navigate('/user/plane-create')}>
        Add Learning Plan
      </button>

      {learningPlans.length > 0 ? (
        learningPlans.map(plan => (
          <LearningPlaneCard key={plan.id} LearningPlane={plan} onDelete={handleDelete} />
        ))
      ) : (
        <p className="text-center mt-4">No Learning Plans found.</p>
      )}
    </div>
  );
}

export default LearningPlane;
