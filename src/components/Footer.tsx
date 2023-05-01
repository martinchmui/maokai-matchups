import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container-padding">
        <a href="mailto:maokaimatchups@gmail.com?Subject=Maokai%20Matchups%20Feedback">
          Contact
        </a>
        <p>
          Maokai Matchups isn't endorsed by Riot Games and doesn't reflect the
          views or opinions of Riot Games or anyone officially involved in
          producing or managing Riot Games properties. Riot Games, and all
          associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
