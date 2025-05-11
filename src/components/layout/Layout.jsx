import React from 'react';

const Layout = ({ children }) => {
  // This is a simple wrapper component that just renders its children
  // We're using this to maintain compatibility with the IncentiveRulesList component
  // which expects to be wrapped in a Layout component
  return <>{children}</>;
};

export default Layout;
