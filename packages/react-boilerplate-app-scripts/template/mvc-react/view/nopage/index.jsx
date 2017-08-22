import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

class NoPage extends React.Component {
  render() {
    return (
      <section className="center nopage-con">
        <article>
          <h1 className="header">404</h1>
          <p className="error">ERROR</p>
        </article>
        <article>
          <ul>
            <li>
              <Link to="/">Back to Home</Link>
            </li>
          </ul>
        </article>
      </section>
    );
  }
}
export default NoPage;
