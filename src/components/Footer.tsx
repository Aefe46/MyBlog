export default function Footer() {
  return (
    <footer className="footer">
        <div className="container footer-inner">
            <p>&copy; <span>{new Date().getFullYear()}</span> Benim Sitem. Tüm hakları saklıdır.</p>
        </div>
    </footer>
  );
}
