

function App() {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#1890ff', marginBottom: '20px' }}>
        🔧 Plateforme de Maintenance Industrielle
      </h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Bienvenue sur votre plateforme de maintenance
      </p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ✅ Serveur Frontend Opérationnel
        </p>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Prêt pour l'implémentation de l'authentification
        </p>
      </div>
    </div>
  )
}

export default App
