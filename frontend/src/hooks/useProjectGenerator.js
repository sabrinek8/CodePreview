import { useState } from 'react';
import { usePersistentState } from './usePersistentState';

export const useProjectGenerator = () => {
  const [projectDescription, setProjectDescription] = usePersistentState('projectDescription', "");
  const [projectFeatures, setProjectFeatures] = usePersistentState('projectFeatures', "");
  const [isGenerating, setIsGenerating] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  const generateProject = async (filesContext = '') => {
    if (!projectDescription.trim()) {
      throw new Error("Veuillez entrer une description du projet.");
    }

    setIsGenerating(true);
    try {
      const enrichedDescription = projectDescription + filesContext;
      
      const response = await fetch(`${API_BASE_URL}/generate-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: enrichedDescription,
          features: projectFeatures
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.project_data) {
        return data.project_data;
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setProjectDescription("");
    setProjectFeatures("");
  };

  return {
    projectDescription,
    setProjectDescription,
    projectFeatures,
    setProjectFeatures,
    isGenerating,
    generateProject,
    resetForm
  };
};