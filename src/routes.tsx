import { Route, Routes } from 'react-router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterWithGooglePage from './pages/RegisterWithGooglePage';
import NotFound from './pages/NotFoundPage';
//parent routes
import ParentNavBar from './components/ParentNavBar/ParentNavBar';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentProfile from './pages/parent/ParentProfile';
import ParentJobForm from './pages/parent/ParentJobForm';
import ParentJobList from './pages/parent/ParentJobList';
import ParentJobView from './pages/parent/ParentJobView';
import ParentWorkerList from './pages/parent/ParentWorkerList';
import ParentAwardJob from './pages/parent/ParentAwardJob';
import ParentWorkerDetail from './pages/parent/ParentWorkerDetail';
//worker routes
import WorkerNavBar from './components/WorkerNavBar/WorkerNavBar';
import WorkerParentList from './pages/worker/WorkerParentList';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerJobList from './pages/worker/WorkerJobList';
import WorkerReviews from './pages/worker/WorkerReviews';
import WorkerWonJob from './pages/worker/WorkerWonJob';
import WorkerJobDetails from './pages/worker/WorkerJobDetails';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/registerwithpassword" element={<RegisterPage />} />
    <Route path="/registerwithgoogle" element={<RegisterWithGooglePage />} />
    <Route path="/termsofservice" element={<TermsOfService />} />
    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
    <Route element={<ParentNavBar />}>
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/profile" element={<ParentProfile />} />
      <Route path="/parent/job/new" element={<ParentJobForm />} />
      <Route path="/parent/:jobId/edit" element={<ParentJobForm />} />
      <Route path="/parent/:jobId/view" element={<ParentJobView />} />
      <Route path="/parent/:jobId/award" element={<ParentAwardJob />} />
      <Route path="/parent/jobs" element={<ParentJobList />} />
      <Route path="/parent/workers" element={<ParentWorkerList />} />
      <Route path="/parent/worker/:workerId" element={<ParentWorkerDetail />} />
    </Route>
    <Route element={<WorkerNavBar />}>
      <Route path="/worker/dashboard" element={<WorkerDashboard />} />
      <Route path="/worker/profile" element={<WorkerProfile />} />
      <Route path="/worker/jobs" element={<WorkerJobList />} />
      <Route path="/worker/:jobId/won" element={<WorkerWonJob />} />
      <Route path="/worker/:jobId/view" element={<WorkerJobDetails />} />
      <Route path="/worker/parents" element={<WorkerParentList />} />
      <Route path="/worker/reviews" element={<WorkerReviews />} />
    </Route>
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
