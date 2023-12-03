import React from 'react';
import './ErrorFallback.css';
import FallbackLogo from '../../assets/Images/errorfallback.png';

function ErrorFallback() {
    return (
        <div className='fallback-container'>
            <img className='fallbacklogo' src={FallbackLogo} alt="Fallback Logo" />
            <h1 className='oopstxt'>Oops!</h1>
            <h2 className='somethingtxt'>Something went wrong!</h2>
            <p className='errortxt'>Brace yourself till we get the error fixed.<br></br>
                You may also refresh the page or try again later...</p>
        </div>
    )
}

export default ErrorFallback;