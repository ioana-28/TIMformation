// Filename: ProjectAdminPage.jsx
// This component now fetches data from your API.

import React, { useState, useEffect } from 'react';

// **TODO**: Change this to the path of your API
const API_URL = '/api/projects'; 

function ProjectAdminPage() {
  // === STATE ===
  const [projects, setProjects] = useState([]); // Start with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This holds the data for the form
  const [formData, setFormData] = useState({
    title: '',
    status: 'Planned',
    category: '',
    description: '',
  });

  // Tracks if we are editing (null = creating, id = editing)
  const [editingId, setEditingId] = useState(null);

  // === DATA FETCHING (READ) ===

  // This function fetches projects from your database API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProjects(data); // Load data from the API into state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // This `useEffect` hook runs once when the component loads
  // to fetch the initial data.
  useEffect(() => {
    fetchProjects();
  }, []); // The empty array [] means this runs only once on mount

  // === HANDLERS ===

  // Update form data state as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- CREATE and UPDATE LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (editingId !== null) {
      // --- UPDATE (PUT request) ---
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT', // or 'PATCH'
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update project');
        // Update the project in the local list
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            // **TODO**: Change 'id' to your database's primary key (e.g., _id)
            project.id === editingId ? { ...formData, id: editingId } : project
          )
        );
      } catch (err) {
        setError(err.message);
      }
    } else {
      // --- CREATE (POST request) ---
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create project');
        const newProject = await response.json(); // Get the new project back (with its new ID)
        // Add the new project to the top of the list
        setProjects((prevProjects) => [newProject, ...prevProjects]);
      } catch (err) {
        setError(err.message);
      }
    }
    resetForm();
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    // **TODO**: Change 'id' to your database's primary key (e.g., _id)
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete project');
        // Remove the project from the local list
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // --- EDIT LOGIC (Part 1) ---
  const handleEdit = (project) => {
    // **TODO**: Change 'id' to your database's primary key (e.g., _id)
    setEditingId(project.id);
    setFormData(project);
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  // Reset the form and cancel editing mode
  const resetForm = () => {
    setFormData({
      title: '',
      status: 'Planned',
      category: '',
      description: '',
    });
    setEditingId(null);
  };

  // === JSX (The HTML structure) ===

  // Show loading or error messages
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.page}>
      {/* 1. THE FORM (for Create and Update) */}
      <h2 style={styles.h2}>
        {editingId ? 'Edit Project' : 'Create New Project'}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* ... (Form inputs are the same as before) ... */}
        <div style={styles.formFull}>
          <label style={styles.label} htmlFor="title">Project Title</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label style={styles.label} htmlFor="status">Status</label>
          <select
            style={styles.input}
            name="status"
            id="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="În planificare">În planificare</option>
            <option value="În desfășurare">În desfășurare</option>
            <option value="Finalizat">Finalizat</option>
          </select>
        </div>
        <div>
          <label style={styles.label} htmlFor="category">Category</label>
          <input
            style={styles.input}
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Urban Regeneration"
            required
          />
        </div>
        <div style={styles.formFull}>
          <label style={styles.label} htmlFor="description">Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div style={styles.formFull}>
          <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
            {editingId ? 'Update Project' : 'Save New Project'}
          </button>
          {editingId && (
            <button
              type="button"
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* 2. THE PROJECT LIST (for Read and Delete) */}
      <h2 style={styles.h2}>Existing Projects</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Project Title</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            // **TODO**: Change 'id' to your database's primary key (e.g., _id)
            <tr key={project.id}>
              <td style={styles.td}>{project.title}</td>
              <td style={styles.td}>{project.status}</td>
              <td style={styles.td}>{project.category}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.actionButton, ...styles.editButton }}
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- (Optional) Style for the page ---
const styles = {
  page: { fontFamily: 'Arial, sans-serif', margin: '20px' },
  h2: { borderBottom: '2px solid #eee', paddingBottom: '10px' },
  form: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  formFull: { gridColumn: '1 / -1' },
  input: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
  textarea: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  button: { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  saveButton: { background: '#007bff', color: 'white' },
  cancelButton: { background: '#6c757d', color: 'white', marginLeft: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { background: '#f4f4f4', textAlign: 'left', padding: '12px', border: '1px solid #ddd' },
  td: { padding: '12px', border: '1-px solid #ddd' },
  actionButton: { padding: '5px 10px', marginRight: '5px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  editButton: { background: '#ffc107' },
  deleteButton: { background: '#dc3545', color: 'white' },
};

export default ProjectAdminPage;