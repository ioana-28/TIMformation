import React, { CSSProperties } from 'react';

// --- 1. FUNCȚIE PENTRU CULOAREA STATUSULUI (Fundal deschis, Text colorat) --


// --- 2. COMPONENTA PAGINII DE ADMIN (STATICĂ) ---
const AdminPage: React.FC = () => {

  // Am hardcodat stilurile pentru a le arăta în exemplu


  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Administrator de Proiecte</h1>
        {/* Link-ul a fost înlocuit cu un <a> simplu pentru a elimina dependența de 'next/link' */}
        <a href="/" style={styles.linkBack}>
          &larr; Acasa (Hartă)
        </a>
      </div>

      <div style={styles.contentWrapper}>

        {/* Formular Card */}
        <form style={styles.card}>
          <h2 style={styles.h2}>Adăugare Proiect</h2>
          
          <div style={styles.formGrid}>
            
            <div style={styles.gridSpan2}>
              <label style={styles.label}>Titlu</label>
              <input
                type="text"
                name="title"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Status</label>
              <select name="status" style={styles.input}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            
            <div>
              <label style={styles.label}>Categorie</label>
              <input
                type="text"
                name="category"
                style={styles.input}
              />
            </div>

            <div style={styles.gridSpan2}>
              <label style={styles.label}>Locație</label>
              <input
                type="text"
                name="location"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Designer</label>
              <input
                type="text"
                name="designer"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Beneficiar</label>
              <input
                type="text"
                name="beneficiary"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.buttonPrimary}>
              Adăugare Proiect
            </button>
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
                {/* Rânduri statice pentru a arăta designul */}
                <tr style={styles.tableRow}>
                  <td style={styles.td}>Reabilitare Pod Traian</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusPill,
                  
                      }}>
                      In Progress
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.buttonEdit}>Editare</button>
                    <button style={styles.buttonDelete}>Ștergere</button>
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.td}>Extindere Parc Botanic</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusPill,
                    
                      }}>
                      Planning
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.buttonEdit}>Editare</button>
                    <button style={styles.buttonDelete}>Ștergere</button>
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.td}>Modernizare Piața Unirii</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusPill,
    
                      }}>
                      Completed
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.buttonEdit}>Editare</button>
                    <button style={styles.buttonDelete}>Ștergere</button>
                  </td>
                </tr>
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