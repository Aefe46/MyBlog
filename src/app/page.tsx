import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Home() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <section className="hero" style={{ textAlign: 'left', padding: '40px 0' }}>
        <h1 className="hero-title" style={{ fontSize: '3rem' }}>
          Kendi dünyama <br /><span style={{ color: 'var(--accent-color)' }}>hoş geldiniz ✨</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.3rem', marginTop: '20px' }}>
          Tamamen kendime özgü, düşüncelerimi ve yazılarımı paylaştığım dijital alanım.
        </p>
      </section>

      <section className="posts-section" style={{ marginTop: '50px' }}>
        <h2 className="section-title">Uzun Yazılarım</h2>
        <div className="posts-grid">
          {posts.length === 0 ? (
            <article className="post-card">
              <div className="post-card-content">
                <span className="post-date">Şimdi</span>
                <h3 className="post-title">Henüz yazı eklenmedi...</h3>
                <p className="post-description">Yönetici panelinden ilk yazınızı ekleyebilirsiniz.</p>
              </div>
            </article>
          ) : (
            posts.map(post => (
              <article key={post.id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</div>
                <p className="post-excerpt">{post.description}</p>
                {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} style={{width: '100%', borderRadius: '12px', marginTop: '15px', objectFit: 'cover', maxHeight: '400px'}} />
                )}
                <div className="post-footer">
                  <div className="post-tags">
                    {post.tags.split(',').filter(t => t.trim() !== '').map(tag => (
                      <span key={tag} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
