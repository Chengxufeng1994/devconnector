// import Head from 'next/head';
// import Image from 'next/image';
import Layout from '../components/Layout';
// import styles from '../styles/Home.module.css';

const Home = () => (
  <>
    <Layout>
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Developer Connector</h1>
            <p className="lead">
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className="buttons">
              <a href="register.html" className="btn btn-primary">
                Sign Up
              </a>
              <a href="login.html" className="btn btn-light">
                Login
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  </>
);

export default Home;
