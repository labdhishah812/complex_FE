import React from 'react';
import underdevlopmentImage from '../../../../../src/assets/images/Under construction-pana.svg';

const UnderDevelopmentPage = () => {
  return (
    <div className="under-development-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:'50px'
    //   height: '100vh',
    //   backgroundColor: '#fff',
    //   overflowY: 'hidden'
    }}>
      <div className="content-wrapper" style={{
        textAlign: 'center',
        maxWidth: '800px',
        padding: '60px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="illustration-container" style={{
          marginBottom: '16px'
        }}>
          <img src={underdevlopmentImage} alt="Under Construction" className="illustration" style={{
            maxWidth: '400px',
            width: '100%'
          }} />
        </div>
        <h1 className="title" style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#43A047',
          marginBottom: '24px'
        }}>Under Development</h1>
        <p className="description" style={{
          fontSize: '20px',
          color: '#333',
          marginBottom: '36px'
        }}>
          We're currently working on improving our services. Please check back soon for updates.
        </p>

      </div>
    </div>
  );
};

export default UnderDevelopmentPage;
