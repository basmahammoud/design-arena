// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import Login from './Pages/Login/Login';
import Layout from './components/layout/layout';
import Homepage from './Pages/homepage/Homepage';
import Signup from './Pages/signup/signup';
import Profile from './Pages/profile/profile';
import Verify from './Pages/verify/verify';
import Design from './Pages/design-page/design-page';
import ChoseDesign from './components/models/chose-design/chose-design';
import Editor from './components/design/canvas/editor/Editor';
import Preview from './components/models/preview/preview';
import Courses from './Pages/courses/courses';
import Subcategory from './Pages/subcategory/subcategory';
import Video from './Pages/video/video';
import Payment from './Pages/payment/payment';
import { AuthProvider } from './hooks/useAuth';
import Savedvideo from './Pages/savedvideo/savedvideo';
import Lives from './components/streming/lives/lives';
import ViewerRoom from './components/streming/ViewerRoom/ViewerRoom';
import PublisherRoom from './components/streming/PublisherRoom';
import PublisherPageWrapper from './components/streming/PublisherPageWrapper';

function App() {
  return (
        <AuthProvider>
    <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/verify" element={<Verify />}/> */}
              <Route path="/editor" element={<Editor />} />
              <Route path="/preview" element={<Preview />} />
             
              {/* نغلف الصفحات التي تحتاج Sidebar بمكون Layout */}

              <Route path="/homepage" element={<Layout><Homepage /></Layout>} />
              <Route path="/portfolio" element={<Layout><Profile /></Layout>} />
              <Route path="/design" element={<Layout><Design /></Layout>} />
              <Route path="/choseDesign" element={<Layout><ChoseDesign /></Layout>} />
              <Route path="/categories" element={<Layout><Courses /></Layout>} />
              <Route path="/subcategories/:id" element={<Layout><Subcategory /></Layout>} />
             <Route path="/subcategories/:id/videos" element={<Layout><Video/></Layout>} />
             <Route path="/payment/:id" element={<Payment/>} />
             <Route path="/savedvido" element={<Savedvideo />} />
             <Route path="/lives" element={<Layout><Lives /></Layout>} />
             <Route path="/viewer-token" element={<Layout><ViewerRoom /></Layout>} />
             {/* <Route path="/Publisher" element={<Layout><PublisherRoom /></Layout>} /> */}
              <Route path="/publisher" element={<PublisherPageWrapper />} />


              {/* <Route path="/navpage/*" element={<Layout><Navpage /></Layout>} /> */}
            </Routes>

    </BrowserRouter>
        </AuthProvider>

  );
}

export default App;
