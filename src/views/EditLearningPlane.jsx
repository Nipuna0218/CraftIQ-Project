import { useParams } from "react-router-dom";
import EditLearningPlancomponent from "../components/learningPlane/EditLearningPlan"; // adjust path if needed
import { useEffect, useState } from "react";

function EditLearningPlane() {
  const { id } = useParams();
  const numericId = parseInt(id, 10);
  const [selectedLearningPlane, setSelectedLearningPlane] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await fetch(`http://localhost:8086/api/learningPlans/${numericId}`);
        if (!response.ok) throw new Error("Failed to fetch learning plan");
        const data = await response.json();

        // Reconstruct front-end compatible structure
        const weeks = data.weeks.map((week, index) => {
          const milestones = data.milestones.slice(index * 3, (index + 1) * 3);
          return {
            week,
            milestones,
          };
        });

        const structuredPlan = {
          id: data.id,
          title: data.title,
          description: data.description,
          deadline: data.deadline || null,
          weeks,
        };

        setSelectedLearningPlane(structuredPlan);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, [numericId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      {selectedLearningPlane ? (
        <EditLearningPlancomponent LearningPlane={selectedLearningPlane} />
      ) : (
        <p>Learning Plan not found.</p>
      )}
    </div>
  );
}

export default EditLearningPlane;

