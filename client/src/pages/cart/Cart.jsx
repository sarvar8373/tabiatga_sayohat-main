import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

export default function Cart() {
  return (
    <div>
      <header className="header-area style-2 header-border absulate-header">
        <Header />
      </header>

      <div className="bradcumb-area cart overlay-bg-4">
        <div className="container text-center">
          <h3>Savat</h3>
        </div>
      </div>

      <Footer />
    </div>
  );
}
