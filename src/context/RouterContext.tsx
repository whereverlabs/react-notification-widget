import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  ElementType,
  useEffect,
} from 'react';
import { useAccount } from 'wagmi';
import { EmailVerified, Feed, Settings, Subscribe, VerifyEmail, WalletDisconnected } from 'screens';

enum Routes {
  Subscribe = 'Subscribe',
  Settings = 'Settings',
  ConnectEmail = 'ConnectEmail',
  NotificationsFeed = 'NotificationsFeed',
  VerifyEmail = 'VerifyEmail',
  EmailVerified = 'EmailVerified',
  WalletDisconnected = 'WalletDisconnected',
}

type RouterProps = {
  [key: string]: string;
};

type RouterContext = {
  activeRoute: Routes;
  setRoute(route: Routes): void;
  setRouteProps(props: RouterProps): void;
  Component: ElementType;
  props?: RouterProps;
};

const RouterContext = createContext<RouterContext>({
  activeRoute: Routes.Subscribe,
} as RouterContext);

const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(Routes.Subscribe);
  const [routerProps, setRouterProps] = useState<RouterProps>({});
  const { isConnected: isLoggedIn } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) {
      setActive(Routes.WalletDisconnected);
    } else {
      //TODO: handle case when user is already opted in and redirect directly to the feed
      setActive(Routes.Subscribe);
    }
  }, [isLoggedIn]);

  const handleChangeRoute = (route: Routes) => {
    setActive(route);
  };

  const handleChangeRouterProps = (props: RouterProps) => {
    setRouterProps(props);
  };

  const RouteScreens = {
    [Routes.Subscribe]: Subscribe,
    [Routes.Settings]: Settings,
    [Routes.ConnectEmail]: Settings,
    [Routes.NotificationsFeed]: Feed,
    [Routes.VerifyEmail]: VerifyEmail,
    [Routes.EmailVerified]: EmailVerified,
    [Routes.WalletDisconnected]: WalletDisconnected,
  };

  return (
    <RouterContext.Provider
      value={{
        activeRoute: active,
        setRoute: handleChangeRoute,
        setRouteProps: handleChangeRouterProps,
        Component: RouteScreens[active],
        props: routerProps,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

function useRouterContext() {
  return useContext(RouterContext);
}

export { Routes, RouterProvider, useRouterContext };
