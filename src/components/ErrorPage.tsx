import React, { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/errorPage.css';
import LiveNotification from './LiveNotification';
import { useAppSelector } from '../redux/hooks';

interface ErrorPageProps {
  missingChamp?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ missingChamp }) => {
  const mode = useAppSelector((state) => state.darkMode.mode);
  const error = useRouteError();

  useEffect(() => {
    document.title = 'Page Not Found';
  });

  return (
    <div id="root-container" className={`root-${mode}`}>
      <div className="main-content">
        <Header />
        <div className="error-page-container">
          <div className="error-message">
            <h1>Now, where did I put that sapling...?</h1>
            <img src="/error-image.png" alt="errorimage" height={300} />
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>
                {isRouteErrorResponse(error)
                  ? error.data?.message || error.statusText
                  : missingChamp
                  ? 'Champion not found'
                  : 'Unknown error message'}
              </i>
            </p>
          </div>
          <br />
          <div className="alt-container">
            <p>
              Please check out the original matchups spreadsheet{' '}
              <a
                href="https://docs.google.com/spreadsheets/d/1l3w-cQ9vGLMNZ1dvqIYL68vypXSnQSVPyiOpdAZXxmo/edit#gid=0"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                here
              </a>
              .
            </p>
            <p>
              If you think this page should be available, please feel free to
              reach out at{' '}
              <a
                href="mailto:maokaimatchups@gmail.com?Subject=Maokai%20Matchups%20Feedback"
                className="link"
              >
                maokaimatchups@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <LiveNotification />
    </div>
  );
};

export default ErrorPage;
