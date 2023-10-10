import React, { useState } from 'react';
import { Spinner } from './Spinner'

export const LabelTituloGeneral = ({titulo}) => {
    return (
        <label className="text-[#336fbb] text-[25px] underline">{titulo}</label>
    )
}