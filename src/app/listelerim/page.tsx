import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function ListelerimPage() {
  const groups = await prisma.listGroup.findMany({
    include: { items: true },
    orderBy: { id: 'asc' }
  });

  return (
    <>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '50px', paddingBottom: '30px', borderBottom: '1px dotted var(--border-color)' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Kişisel Listelerim 📋</h1>
        <p className="hero-subtitle" style={{ margin: '0 auto' }}>Sevdiğim her şeyi burada listeliyorum.</p>
      </div>

      <div className="lists-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {groups.length === 0 ? (
          <div className="list-card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '25px' }}>
              <div className="list-icon" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🗑️</div>
              <h3 className="list-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', color: 'var(--text-primary)' }}>Henüz liste eklenmedi</h3>
              <p style={{color: 'var(--text-secondary)'}}>Yönetim panelinden ilk listenizi oluşturabilirsiniz.</p>
          </div>
        ) : (
            groups.map(group => (
                <div key={group.id} className="list-card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '25px', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="list-icon" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{group.icon}</div>
                    <h3 className="list-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', color: 'var(--text-primary)' }}>{group.title}</h3>
                    <ul className="list-items" style={{ listStyle: 'none' }}>
                        {group.items.map(item => (
                            <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '10px' }}>•</span> {item.text}
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        )}
      </div>
    </>
  );
}
