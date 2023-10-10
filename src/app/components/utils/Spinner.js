import React from 'react';
import '../../../assets/css/components/spinner.css';
export const Spinner = (props) => {
    return (
        <i className={`fas fa-spinner spinner ${props.spinner === 'false' && 'hidden'}`}></i>
    )
}