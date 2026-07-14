import "./Header.css";

interface HeaderProps {
    children: React.ReactNode; // page specific content
}

function Header({ children }: HeaderProps) {
    return (
        <header className="app-header">
            {children}
        </header>
    );
}

export default Header;