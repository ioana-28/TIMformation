
'use client';

import React, { CSSProperties, useState, useEffect } from 'react';
import Link from 'next/link';
import type { Project } from '@/components/ProjectList';

// Helper functions for status colors
const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'Finalizat': return '#dcf8e5';
    case 'În planificare': return '#f0e0d0';
    case 'În desfășurare': return '#cce5ff';
    default: return '#f9f9f9';
  }
};

const getStatusTextColor = (status: string): string => {
  switch (status) {
    case 'Finalizat': return '#3c763d';
    case 'În planificare': return '#8a6d3b';
    case 'În desfășurare': return '#31708f';
    default: return '#666';
  }
};

// --- 1. FUNCȚIE PENTRU CULOAREA STATUSULUI (Fundal deschis, Text colorat) --


// --- 2. COMPONENTA PAGINII DE ADMIN ---
const AdminPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from server-side API on mount
  useEffect(() => {
    let mounted = true;
    async function fetchProjects() {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (!mounted) return;
        setProjects((json.projects || []) as Project[]);
      } catch (e) {
        console.error('Unexpected error fetching projects via API:', e);
        setError('Failed to load projects');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProjects();
    return () => { mounted = false };
  }, []);

  const handleDelete = async (id: number) => {
    console.log("id:", id);
    if (!confirm('Ești sigur că vrei să ștergi acest proiect?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      console.log(res);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        console.error('Error deleting project via API', json);
        alert('A apărut o eroare la ștergerea proiectului.');
        return;
      }
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('Unexpected error deleting:', e);
      alert('A apărut o eroare.');
    }
  };

  const handleEdit = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return alert('Proiectul nu a fost găsit');

    // Prefill form with project data and switch to edit mode
    setTitle(project.title || '');
    setStatusValue(project.status || 'În Planificare');
    setCategoryValue(project.category || '-');
    setLocationValue(project.location || '-');
    setDesignerValue(project.designer || '-');
    setBeneficiaryValue(project.beneficiary || '-');
    setRealizationDurationValue(project.realization_duration_months ? project.realization_duration_months.toString() : '-');
    setExecutionDurationValue(project.execution_duration_months ? project.execution_duration_months.toString() : '-');
    setTotalValueValue(project.total_value ? project.total_value.toString() : '-');
    setLatestChangeValue(project.latest_change || '-');
    setDescriptionValue(project.description || '-');
    setEditingId(id);
    setFormMessage(null);
  };

  // Form state for creating a project
  const [title, setTitle] = useState('');
  const [statusValue, setStatusValue] = useState('În Planificare');
  const [categoryValue, setCategoryValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [designerValue, setDesignerValue] = useState('');
  const [beneficiaryValue, setBeneficiaryValue] = useState('');
  const [totalValueValue, setTotalValueValue] = useState('');
  const [realizationDurationValue, setRealizationDurationValue] = useState('');
  const [executionDurationValue, setExecutionDurationValue] = useState('');
  const [latestChangeValue, setLatestChangeValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  // id of project being edited (null when creating)
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!title.trim() || !locationValue.trim() || !statusValue.trim()) {
      setFormMessage('Titlu, locație și status sunt obligatorii.');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      status: statusValue,
      category: categoryValue || null,
      location: locationValue.trim(),
      designer: designerValue || null,
      beneficiary: beneficiaryValue || null,
      total_value: totalValueValue ? parseFloat(totalValueValue) : null,
      realization_duration_months: realizationDurationValue ? parseInt(realizationDurationValue, 10) : null,
      execution_duration_months: executionDurationValue ? parseInt(executionDurationValue, 10) : null,
      latest_change: latestChangeValue || null,
      description: descriptionValue || null,
    };

    try {
      // If editing, send PATCH to update existing project
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error('Update project error', json);
          setFormMessage(json?.error || 'A apărut o eroare la actualizare.');
          return;
        }

        const updated: Project = json.project;
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        setFormMessage('Proiect actualizat cu succes.');
        // exit edit mode
        setEditingId(null);
      } else {
        // Create new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error('Create project error', json);
          setFormMessage(json?.error || 'A apărut o eroare la adăugare.');
          return;
        }

        const newProject: Project = json.project;
        // Prepend new project to the list
        setProjects(prev => [newProject, ...prev]);

        setFormMessage('Proiect adăugat cu succes.');
      }

      // Reset form fields after success
      setTitle('');
      setStatusValue('În Planificare');
      setCategoryValue('-');
      setLocationValue('');
      setDesignerValue('-');
      setBeneficiaryValue('-');
      setTotalValueValue('-');
      setRealizationDurationValue('-');
      setExecutionDurationValue('-');
      setLatestChangeValue('-');
      setDescriptionValue('-');
    } catch (err) {
      console.error('Unexpected error creating/updating project', err);
      setFormMessage('A apărut o eroare neașteptată.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setStatusValue('În Planificare');
    setCategoryValue('');
    setLocationValue('');
    setDesignerValue('');
    setBeneficiaryValue('');
    setTotalValueValue('');
    setRealizationDurationValue('');
    setExecutionDurationValue('');
    setLatestChangeValue('');
    setDescriptionValue('');
    setFormMessage(null);
  };


  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Administrator de Proiecte</h1>
        {/* Link-ul a fost înlocuit cu un <a> simplu pentru a elimina dependența de 'next/link' */}
                <Link href="/" style={styles.linkBack}>
          &larr; Acasa (Hartă)
                </Link>
      </div>

      <div style={styles.contentWrapper}>

        {/* Formular Card */}
        <form onSubmit={handleCreateProject} style={styles.card}>
          <h2 style={styles.h2}>Adăugare Proiect</h2>
          
          <div style={styles.formGrid}>
            
            <div style={styles.gridSpan2}>
              <label style={styles.label}>Titlu</label>
              <input
                type="text"
                name="title"
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Status</label>
              <select name="status" style={styles.input} value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                <option value="În Planificare">În Planificare</option>
                <option value="În Desfășurare">În Desfășurare</option>
                <option value="Finalizat">Finalizat</option>
              </select>
            </div>
            
            <div>
              <label style={styles.label}>Categorie</label>
              <input
                type="text"
                name="category"
                style={styles.input}
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
              />
            </div>

            <div style={styles.gridSpan2}>
              <label style={styles.label}>Locație</label>
              <input
                type="text"
                name="location"
                style={styles.input}
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Designer</label>
              <input
                type="text"
                name="designer"
                style={styles.input}
                value={designerValue}
                onChange={(e) => setDesignerValue(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Beneficiar</label>
              <input
                type="text"
                name="beneficiary"
                style={styles.input}
                value={beneficiaryValue}
                onChange={(e) => setBeneficiaryValue(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Valoare Totală</label>
              <input
                type="text"
                name="total_value"
                style={styles.input}
                value={totalValueValue}
                onChange={(e) => setTotalValueValue(e.target.value)}
              />
            </div>

             <div>
              <label style={styles.label}>Durată Realizare</label>
              <input
                type="text"
                name="realization_duration_months"
                style={styles.input}
                value={realizationDurationValue}
                onChange={(e) => setRealizationDurationValue(e.target.value)}
              />
            </div>

             <div>
              <label style={styles.label}>Durată Execuție</label>
              <input
                type="text"
                name="execution_duration_months"
                style={styles.input}
                value={executionDurationValue}
                onChange={(e) => setExecutionDurationValue(e.target.value)}
              />
            </div>

             <div>
              <label style={styles.label}>Ultima Modificare</label>
              <input
                type="text"
                name="latest_change"
                style={styles.input}
                value={latestChangeValue}
                onChange={(e) => setLatestChangeValue(e.target.value)}
              />
            </div>

             <div style={styles.gridSpan2}>
              <label style={styles.label}>Descriere</label>
              <input
                type="textarea"
                name="description"
                style={styles.input}
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.buttonPrimary} disabled={submitting}>
              {submitting ? (editingId ? 'Se actualizează...' : 'Se adaugă...') : (editingId ? 'Actualizare Proiect' : 'Adăugare Proiect')}
            </button>
            {editingId && (
              <button type="button" style={{ ...styles.buttonDelete, marginLeft: '12px' }} onClick={handleCancelEdit} disabled={submitting}>
                Anulează
              </button>
            )}
            {formMessage && <p style={{ marginTop: '10px', color: formMessage.includes('succes') ? 'green' : 'red' }}>{formMessage}</p>}
          </div>
        </form>

        {/* Tabel Card */}
        <div style={styles.card}>
          <h2 style={styles.h2}>Proiecte Existente</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Titlu</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr style={styles.tableRow}>
                    <td style={styles.td} colSpan={3}>Se încarcă...</td>
                  </tr>
                )}
                {error && (
                  <tr style={styles.tableRow}>
                    <td style={{ ...styles.td, color: 'red' }} colSpan={3}>Eroare: {error}</td>
                  </tr>
                )}
                {!loading && projects.length === 0 && (
                  <tr style={styles.tableRow}>
                    <td style={styles.td} colSpan={3}>Niciun proiect găsit</td>
                  </tr>
                )}
                {projects.map(project => (
                  <tr key={project.id} style={styles.tableRow}>
                    <td style={styles.td}>{project.title}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.statusPill,
                        backgroundColor: getStatusBgColor(project.status),
                        color: getStatusTextColor(project.status),
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.buttonEdit} onClick={() => handleEdit(project.id)}>Editare</button>
                      <button style={styles.buttonDelete} onClick={() => handleDelete(project.id)}>Ștergere</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div> {/* Sfârșitul .contentWrapper */}
    </div>
  );
}

// --- 3. OBIECTUL DE STILURI (Temă albastră închisă, Roșu deschis) ---
const styles: { [key: string]: CSSProperties } = {
  // Stilizare pagină
  page: {
    fontFamily: 'Arial, sans-serif',
    background: '#f0f4f8', 
    minHeight: '100vh',
    padding: '0',
  },
  
  // Header structurat
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem', 
    background: '#ffffff', 
    padding: '1.5rem 2.5rem', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
  },
  h1: {
    color: '#2c3e50', 
    margin: '0',
    fontSize: '1.8rem',
  },
  h2: {
    color: '#2c3e50',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '0.5rem',
    marginTop: '0',
    marginBottom: '1.5rem',
  },
  linkBack: {
    color: '#0056b3', // Albastru închis
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  
  // Wrapper pentru conținut
  contentWrapper: {
    padding: '2rem 2.5rem 2.5rem', 
    maxWidth: '1400px', 
    margin: '0 auto', 
  },

  // Stilizare Card & Formular
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    marginBottom: '2.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  gridSpan2: {
    gridColumn: '1 / -1',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1em',
    color: '#0e0226ff',
    boxSizing: 'border-box',
    background: '#fff',
  },
  
  // Stilizare Tabel
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeadRow: {
    background: '#f9f9f9',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    color: '#333',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  td: {
    padding: '1rem',
    color: '#333',
    minWidth: '150px',
  },
  statusPill: {
    padding: '5px 12px', // Padding ajustat
    fontSize: '0.85em',
    borderRadius: '15px',
    fontWeight: '600',
    display: 'inline-block',
  },

  // Stilizare Butoane
  buttonContainer: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e0e0e0',
  },
  buttonPrimary: {
    padding: '12px 20px',
    background: '#0056b3', // Albastru închis
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    marginRight: '1rem',
  },
  buttonEdit: {
    padding: '6px 12px',
    background: '#31708f', // Albastru-gri închis
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  buttonDelete: {
    padding: '6px 12px',
    background: '#e79999ff', // Roșu și mai deschis
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminPage;