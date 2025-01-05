import { NavigateFunction } from 'react-router-dom';

export const templates = (navigate: NavigateFunction) => [
  {
    id: 1,
    name: 'Resume',
    description: 'Create a professional resume.',
    html: `
      <h1 style="text-align: center; font-size: 2.5em; font-weight: bold;">Your Name</h1>
      <p style="text-align: center; font-size: 1.2em; color: gray;">[Your Profession]</p>
      <hr style="margin: 20px 0; border: none; border-top: 2px solid #ccc;" />
      <h2 style="font-size: 1.8em; font-weight: bold;">Professional Summary</h2>
      <p>[Write a compelling summary highlighting your skills and experience.]</p>
      <h2 style="font-size: 1.8em; font-weight: bold;">Work Experience</h2>
      <h3 style="font-size: 1.5em; font-weight: bold;">[Job Title]</h3>
      <p style="font-size: 1em; font-weight: bold; color: gray;">[Company Name] | [Years Worked]</p>
      <ul>
        <li>[Key responsibility or achievement]</li>
        <li>[Another key responsibility or achievement]</li>
      </ul>
      <h2 style="font-size: 1.8em; font-weight: bold;">Education</h2>
      <h3 style="font-size: 1.5em; font-weight: bold;">[Degree Name]</h3>
      <p style="font-size: 1em; font-weight: bold; color: gray;">[University Name] | [Years Attended]</p>
      <h2 style="font-size: 1.8em; font-weight: bold;">Skills</h2>
      <ul>
        <li>[Skill 1]</li>
        <li>[Skill 2]</li>
        <li>[Skill 3]</li>
      </ul>
    `,
    onClick: function() { navigate('/editor', { state: { template: this.html } }) },
  },
  {
    id: 2,
    name: 'Brainstorm',
    description: 'organize your creative ideas.',
    html: `
      <h1 style="text-align: center; font-size: 2em; font-weight: bold;">Brainstorming Session</h1>
      <hr style="margin: 20px 0; border: none; border-top: 2px solid #007BFF;" />
      <h2 style="font-size: 1.5em; font-weight: bold;">Session Goals</h2>
      <p style="font-size: 1em;">[List the objectives of your brainstorming session here.]</p>
      <h2 style="font-size: 1.5em; font-weight: bold;">Ideas</h2>
      <ul>
        <li>[Idea 1]</li>
        <li>[Idea 2]</li>
        <li>[Idea 3]</li>
      </ul>
      <h2 style="font-size: 1.5em; font-weight: bold;">Next Steps</h2>
      <p>[Summarize action items based on the brainstorming session.]</p>
    `,
    onClick: function() { navigate('/editor', { state: { template: this.html } }) },
  },
  {
    id: 3,
    name: 'Meeting Notes',
    description: 'Keep track of meeting details.',
    html: `
      <h1 style="text-align: center; font-size: 2em; font-weight: bold;">Meeting Notes</h1>
      <p style="font-size: 1em; color: gray;"><strong>Date:</strong> [Insert Date]</p>
      <p style="font-size: 1em; color: gray;"><strong>Participants:</strong> [List Names]</p>
      <hr style="margin: 20px 0; border: none; border-top: 2px solid #FF6347;" />
      <h2 style="font-size: 1.5em; font-weight: bold;">Agenda</h2>
      <ul>
        <li>[Agenda Item 1]</li>
        <li>[Agenda Item 2]</li>
      </ul>
      <h2 style="font-size: 1.5em; font-weight: bold;">Key Discussion Points</h2>
      <p>[Summarize main points discussed.]</p>
      <h2 style="font-size: 1.5em; font-weight: bold;">Action Items</h2>
      <ul>
        <li>[Action Item 1]</li>
        <li>[Action Item 2]</li>
      </ul>
    `,
    onClick: function() { navigate('/editor', { state: { template: this.html } }) },
  },
  {
    id: 4,
    name: 'To-Do List',
    description: 'prioritize your tasks.',
    html: `
      <h1 style="text-align: center; font-size: 2em; font-weight: bold;">To-Do List</h1>
      <ul>
        <li>[Task 1]</li>
        <li>[Task 2]</li>
        <li>[Task 3]</li>
      </ul>
    `,
    onClick: function() { navigate('/editor', { state: { template: this.html } }) },
  },
];
