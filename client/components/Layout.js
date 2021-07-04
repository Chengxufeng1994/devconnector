import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Header from './Header';

const Layout = ({ children }) => (
  <>
    <Head>
      <title>Welcome To The Developer Connector</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    {children}
  </>
);

export default Layout;

Layout.defaultProps = {
  children: null,
};
Layout.propTypes = {
  children: PropTypes.node,
};