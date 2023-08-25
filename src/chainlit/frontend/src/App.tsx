import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { router } from 'router';
import makeTheme from 'theme';

import { Box, GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material';

import Hotkeys from 'components/Hotkeys';
import SettingsModal from 'components/molecules/settingsModal';
import Socket from 'components/socket';

import { useAuth } from 'hooks/auth';
import { useApi } from 'hooks/useApi';

import { settingsState } from 'state/settings';
import { Role, accessTokenState, roleState } from 'state/user';

import './App.css';

function App() {
  const { theme: themeVariant } = useRecoilValue(settingsState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [role, setRole] = useRecoilState(roleState);
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth();
  const theme = makeTheme(themeVariant);

  const { data: roleData, error: roleError } = useApi<Role>(
    !role && accessToken ? '/project/role' : null
  );

  useEffect(() => {
    if (roleData !== 'ANONYMOUS' && !role) {
      setRole(roleError ? 'ANONYMOUS' : roleData);
    }
  }, [roleData, roleError]);

  useEffect(() => {
    if (isAuthenticated && accessToken === undefined) {
      getAccessTokenSilently({
        authorizationParams: {
          audience: 'chainlit-cloud'
        }
      })
        .then((token) => setAccessToken(token))
        .catch((err) => {
          console.error(err);
          logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
        });
    }
  }, [isAuthenticated, getAccessTokenSilently, accessToken, setAccessToken]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default }
        }}
      />
      <Toaster
        toastOptions={{
          className: 'toast',
          style: {
            maxWidth: 500,
            fontFamily: 'Inter',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(1),
            color: theme.palette.text.primary,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 2px 4px 0px #0000000D'
                : '0px 10px 10px 0px #0000000D'
          }
        }}
      />
      <Box display="flex" height="100vh" width="100vw">
        <Socket />
        <Hotkeys />
        <SettingsModal />
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
