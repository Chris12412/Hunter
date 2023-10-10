import { useState } from 'react'

export const useMenu = (initialValue = true) => {
    const [ isOpen, setIsOpen ] = useState(initialValue)

    const openMenu = (callback) => {
        setIsOpen(true);
    };
    const closeMenu = (callback) => {
        setIsOpen(false)
    };
    
    return [isOpen, openMenu, closeMenu]
}

// import { useState } from 'react'

// export const useMenu = (initialValue = false) => {
//     const [ isOpen, setIsOpen ] = useState(initialValue)

//     const openMenu = () => setIsOpen(true);
//     const closeMenu = () => setIsOpen(false);
    
//     return [isOpen, openMenu, closeMenu]
// }