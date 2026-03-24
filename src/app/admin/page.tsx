import { PrismaClient } from '@prisma/client';
import { createPost, createIdea, createListGroup, createListItem, deletePost, deleteIdea, deleteListGroup, updateSiteName, createNavLink, deleteNavLink } from './actions';

const prisma = new PrismaClient();

export default async function AdminPage() {
    const groups = await prisma.listGroup.findMany();
    const posts = await prisma.post.findMany();
    const ideas = await prisma.idea.findMany();
    
    const siteNameSetting = await prisma.setting.findUnique({ where: { key: 'siteName' } });
    const currentSiteName = siteNameSetting?.value || 'Benim Köşem';
    const navLinks = await prisma.navLink.findMany({ orderBy: { order: 'asc' } });

    return (
        <>
        <style dangerouslySetInnerHTML={{__html: `
            .form-input {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background-color: var(--bg-color);
                color: var(--text-primary);
                font-family: inherit;
            }
            .del-btn {
                color: #ef4444; border: none; background: none; cursor: pointer; text-align: left; padding: 5px 0; font-size: 1rem;
            }
            .del-btn:hover { text-decoration: underline; }
        `}} />
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <h1 className="hero-title" style={{borderBottom: '2px solid var(--border-color)', paddingBottom: '10px'}}>Yönetim Paneli 🚀</h1>
            
            {/* Site Ayarları Formu */}
            <div className="post-card" style={{padding: '30px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px'}}>
                <h2 style={{marginBottom: '10px'}}>⚙️ Site Ayarları</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Menüde ve üst kısımda görünen sitenizin ismini değiştirin.</p>
                <form action={updateSiteName} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{fontWeight: 600, color: 'var(--text-primary)'}}>Site Adı / Logo Yazısı:</label>
                    <input name="siteName" type="text" defaultValue={currentSiteName} required className="form-input" />
                    <button type="submit" className="btn primary" style={{alignSelf: 'flex-start'}}>Ayarı Kaydet</button>
                </form>
            </div>

            {/* Menü / Sekme Ayarları Formu */}
            <div className="post-card" style={{padding: '30px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px'}}>
                <h2 style={{marginBottom: '10px'}}>🔗 Menü / Sekme Ayarları</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Sitenizin üst kısmında yer alan sekmeleri (sayfaları) yönetin.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {navLinks.map(link => (
                        <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                            <div><strong style={{color: 'var(--text-primary)'}}>{link.title}</strong> <span style={{color: 'var(--text-secondary)'}}>({link.url})</span></div>
                            <form action={async () => { 'use server'; await deleteNavLink(link.id); }}>
                                <button type="submit" className="delete-btn">Sil</button>
                            </form>
                        </div>
                    ))}
                </div>

                <form action={createNavLink} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input name="title" placeholder="Görünen Ad (Örn: Hakkımda)" required className="form-input" style={{flex: 1}} />
                    <input name="url" placeholder="Gidilecek Sayfa (Örn: /hakkimda)" required className="form-input" style={{flex: 1}} />
                    <input name="order" type="number" placeholder="Sıra (1, 2, 3...)" defaultValue={navLinks.length + 1} required className="form-input" style={{width: '100px'}} />
                    <button type="submit" className="btn primary">Sekme Ekle</button>
                </form>
            </div>

            {/* Uzun Yazı Formu */}
            <div className="post-card" style={{padding: '30px'}}>
                <h2 style={{marginBottom: '10px'}}>✍️ Yeni Yazı Ekle</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Ana sayfada görünecek uzun, açıklamalı yazılar.</p>
                <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input name="title" type="text" placeholder="Başlık" required className="form-input" />
                    <textarea name="description" placeholder="Yazının Gövdesi / Ana Metin" required rows={4} className="form-input"></textarea>
                    <input name="tags" placeholder="Etiketler (virgülle ayırın)" required className="form-input" />
                    
                    <label style={{fontWeight: 600, color: 'var(--text-primary)'}}>Kapak Görseli (İsteğe bağlı):</label>
                    <input name="image" type="file" accept="image/*" className="form-input" />

                    <button type="submit" className="btn primary">Yazıyı Yayınla</button>
                </form>
            </div>

            {/* Fikir (Tweet) Formu */}
            <div className="post-card" style={{padding: '30px'}}>
                <h2 style={{marginBottom: '10px'}}>💭 Yeni Fikir (Tweet) Ekle</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Fikirler sekmesinde Twitter gibi görünecek kısa gönderiler.</p>
                <form action={createIdea} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <textarea name="content" placeholder="Aklından ne geçiyor?" required className="form-input" rows={3}></textarea>
                    
                    <label style={{fontWeight: 600, color: 'var(--text-primary)'}}>Fotoğraf (İsteğe bağlı):</label>
                    <input name="image" type="file" accept="image/*" className="form-input" />

                    <button type="submit" className="btn primary">Fikri Paylaş</button>
                </form>
            </div>

            {/* Liste Kategorisi Formu */}
            <div className="post-card" style={{padding: '30px'}}>
                <h2 style={{marginBottom: '10px'}}>📁 Yeni Liste Kategorisi Oluştur</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Listelerim sekmesindeki başlıkları oluşturur (Örn: Favori Filmler).</p>
                <form action={createListGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input name="icon" type="text" placeholder="İkon (Sadece tek bir Emoji koyun, Örn: 🎬)" required className="form-input" />
                    <input name="title" type="text" placeholder="Kategori Başlığı (Örn: En Sevdiğim Filmler)" required className="form-input" />
                    <button type="submit" className="btn primary" style={{alignSelf: 'flex-start'}}>Oluştur</button>
                </form>
            </div>

             {/* Listeye Madde Formu */}
             {groups.length > 0 && (
                <div className="post-card" style={{padding: '30px'}}>
                    <h2 style={{marginBottom: '10px'}}>📝 Kategoriye Madde Ekle</h2>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>Daha önceden oluşturduğunuz bir kategoriye yeni eleman ekler.</p>
                    <form action={createListItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <select name="groupId" className="form-input" required>
                            <option value="">Lütfen kategori seçin...</option>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.icon} {g.title}</option>)}
                        </select>
                        <input name="text" type="text" placeholder="Yazılacak Madde (Örn: Esaretin Bedeli)" required className="form-input" />
                        <button type="submit" className="btn primary" style={{alignSelf: 'flex-start'}}>Maddeyi Ekle</button>
                    </form>
                </div>
             )}

            <div style={{marginTop: '30px', padding: '30px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px'}}>
                <h2 style={{color: '#ef4444', marginBottom: '20px'}}>🗑️ Silme İşlemleri</h2>
                
                {posts.length > 0 && <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Yazılar</h4>}
                {posts.map(p => (
                    <form key={p.id} action={async () => { 'use server'; await deletePost(p.id); }}>
                        <button type="submit" className="del-btn">❌ {p.title}</button>
                    </form>
                ))}
                
                {ideas.length > 0 && <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Fikirler</h4>}
                {ideas.map(i => (
                    <form key={i.id} action={async () => { 'use server'; await deleteIdea(i.id); }}>
                        <button type="submit" className="del-btn">❌ {i.content.substring(0, 40)}...</button>
                    </form>
                ))}

                {groups.length > 0 && <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Listeler (İçindekilerle birlikte silinir)</h4>}
                {groups.map(g => (
                    <form key={g.id} action={async () => { 'use server'; await deleteListGroup(g.id); }}>
                        <button type="submit" className="del-btn">❌ {g.icon} {g.title}</button>
                    </form>
                ))}
            </div>
        </div>
        </>
    );
}
