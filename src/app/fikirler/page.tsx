import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function FikirlerPage() {
  const ideas = await prisma.idea.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px', paddingBottom: '30px', borderBottom: '1px dotted var(--border-color)' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Anlık Düşüncelerim 💭</h1>
        <p className="hero-subtitle" style={{ margin: '0 auto' }}>Burası benim Twitter'ım. İçimden geçen kısa düşünceleri döküyorum.</p>
      </div>

      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        {ideas.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Henüz bir fikir eklemediniz. Yönetim panelinden ilk fikrinizi paylaşın!
            </div>
          </div>
        ) : (
            ideas.map(idea => (
                <div key={idea.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '15px' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>🌟</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Sizin Adınız</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>@benimadim · {idea.createdAt.toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        <div className="tweet-content">
                    {idea.content}
                    {idea.imageUrl && (
                        <div style={{marginTop: '15px'}}>
                            <img src={idea.imageUrl} alt="Fikir Görseli" style={{width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)'}} />
                        </div>
                    )}
                </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </>
  );
}
