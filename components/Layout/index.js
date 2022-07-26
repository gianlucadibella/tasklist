import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className='h-screen'>
            <Header />
            {children}
        </div>
    );
};

export default Layout;