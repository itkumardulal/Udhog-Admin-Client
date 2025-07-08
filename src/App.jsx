import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from './layouts/DashboardLayout';
import CompanyPage from './pages/CompanyPage';
import NewsPage from './pages/NewsPage';
import CompanyTable from './components/CompanyTable';
import News from './components/view/News';
import Notice from './components/view/Notice';
import NoticeForm from './components/addform/NoticeForm';
import Home from './pages/Home';
import Login from './components/auth/Login';
import CompanyEdit from './pages/editpage/CompanyEdit';
import NewsEdit from './pages/editpage/NewsEdit';
import NoticeEdit from './pages/editpage/NoticeEdit';
import Protect from './components/Protected';
import IdCard from './components/download/IdCard';
import Certificate from './components/download/Certificate';


const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          
        
          <Route
            path="/"
            element={
              <Protect>
                <DashboardLayout />
              </Protect>
            }
          >
            <Route index element={<Home />} />
            <Route path="add/company" element={<CompanyPage />} />
            <Route path="add/news" element={<NewsPage />} />
            <Route path="add/notices" element={<NoticeForm />} />
            <Route path="view/companies" element={<CompanyTable />} />
            <Route path="view/notices" element={<Notice />} />
            <Route path="view/news" element={<News />} />
            <Route path="edit/company/:id" element={<CompanyEdit />} />
            <Route path="edit/news/:id" element={<NewsEdit />} />
            <Route path="edit/notices/:id" element={<NoticeEdit />} />
            <Route path="download/id-card" element={<IdCard />} />
            <Route path="download/certificate" element={<Certificate />} />
          </Route>
        </Routes>

        <ToastContainer position="top-right" autoClose={1000} />
      </>
    </Router>
  );
};

export default App;
