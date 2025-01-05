import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/templates.css'; // Custom styles for additional touch-ups
import { templates } from '../lib/utils'; // Import the utility function

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  
  // Get templates by passing navigate to the utility function
  const getTemplate = templates(navigate);

  return (
    <div className="templates-wrapper p-6">
      <h1 className="text-3xl font-bold mb-6">Templates</h1>
      <div className="templates-scroll grid grid-flow-col auto-cols-[45%] gap-4 overflow-x-auto md:auto-cols-[28%] lg:auto-cols-[22%]">
        {getTemplate.map((template) => (
          <div
            key={template.id} 
            className="template-card bg-white shadow-lg rounded-lg p-2 cursor-pointer hover:shadow-xl transition-shadow duration-300 text-wrap  h-44 flex justify-center items-center flex-col "
            onClick={() => template.onClick()}
          >
            <h2 className="text-md font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600 text-sm">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
