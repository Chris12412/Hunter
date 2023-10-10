import React from 'react';
import  ReactTooltip  from 'react-tooltip';

export const Tooltip = ({children, id, type, effect, rest}) => {
    return (
        <>
            <ReactTooltip id={id} type={type || 'light'} effect={effect || "solid"} {...rest}>
                {children}
            </ReactTooltip>
        </>
    )
}