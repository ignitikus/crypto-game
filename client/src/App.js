import React, {Suspense} from 'react';
import Loader from './component/Loader/Loader'
import { Provider } from "./component/Context/Context";


const ProfileDrawer = React.lazy(() => import('./component/Drawer/Drawer'))


function App() {
  return (
    <Provider>
      <Suspense fallback={<Loader/>}>
        <ProfileDrawer />
      </Suspense>
    </Provider>
  );
}

export default App;
