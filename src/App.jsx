import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} /> 
          <Route path="add/company" element={<CompanyPage />} />
          <Route path="add/news" element={<NewsPage />} />
          <Route path="add/notices" element={<NoticeForm />} />
          <Route path="view/companies" element={<CompanyTable />} />
          <Route path="view/notices" element={<Notice />} />
          <Route path="view/news" element={<News />} />
         <Route path="edit/company/:id" element={<CompanyEdit />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;