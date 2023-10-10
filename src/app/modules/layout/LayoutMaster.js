import React, { useState, useEffect, useRef } from 'react'

import '../../../assets/css/layoutMaster.css'

import { Menu } from './Menu'
import { Header } from './Header'
import { Footer } from './Footer'

import { useMenu } from '../../../hooks/useMenu'

function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}

export const LayoutMaster = ({children}) => {
    const [ isOpen, openMenu, closeMenu ] = useMenu(true)
    const [ fondoNegro, setFondoNegro ] = useState(false)
    const menuRef = useRef()

    const toggleContentMenu = (abrirFondoNegro = true) => {
        // const widthActual = menuRef.current.style.width
        const dashboard  = document.querySelector('.dashboard');
        const iconSplit = document.querySelector('#icon-split');

        if (!isOpen) {
            menuRef.current.parentNode.style.width = '300px'
            menuRef.current.style.width = '285px'
            setTimeout(() => {
                dashboard.style.gridTemplateColumns = '300px 1fr 1fr';
            }, 400)
            iconSplit.style.transform = 'rotate(0deg)'
            openMenu()
            setFondoNegro(abrirFondoNegro)
        } else {
            menuRef.current.parentNode.style.width = '15px'
            menuRef.current.style.width = '0px'
            dashboard.style.gridTemplateColumns = '15px 1fr 1fr';
            iconSplit.style.transform = 'rotate(180deg)'
            closeMenu()
            setFondoNegro(false)
        }
    }

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            const split = document.querySelector('#split');

            if (window.innerWidth >= 1024) {
                closeMenu()
                split.style.display = ''
            } else {
                split.style.display = 'none'
            }
        }, 100)

        window.addEventListener('resize', debouncedHandleResize)
        toggleContentMenu(false)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize)
        
        }

    }, [])

    return (
        <>
            <div className="dashboard dark:text-white">
                <Header openMenu={toggleContentMenu}></Header>
                <Menu ref={menuRef} isOpen={isOpen} openMenu={openMenu} closeMenu={closeMenu} toggleContentMenu={toggleContentMenu}></Menu>
                <div className="main overflow-auto">
                    <div className="w-[95%] mx-auto h-full pt-2 pb-4 relative">
                        {children}
                    </div>
                </div>
                <Footer></Footer>
                <div onClick={toggleContentMenu} className={`fondo-negro ${fondoNegro ? '' : 'hidden'}`}></div>
            </div>
        </>
    )
}




//     return (
//         <>
//             <div className="dashboard dark:text-white">
//                 <Header openMenu={toggleContentMenu}></Header>
//                 <Menu ref={menuRef} isOpen={isOpen} openMenu={openMenu} closeMenu={closeMenu} toggleContentMenu={toggleContentMenu}></Menu>
//                 <div className="main overflow-auto">
//                     <div className="w-[95%] mx-auto h-full pt-2 pb-4 relative">
//                         {children}
//                     </div>
//                 </div>
//                 <Footer></Footer>
//                 <div onClick={toggleContentMenu} className={`fondo-negro ${fondoNegro ? '' : 'hidden'}`}></div>
//             </div>
//         </>
//     )
// }

























// import React, { useEffect, useRef, useState } from 'react'
// import '../../../assets/css/layoutMaster.css'

// import { Menu } from './Menu'
// import { Header } from './Header'
// import { Footer } from './Footer'

// import { useMenu } from '../../../hooks/useMenu'

// function debounce(fn, ms) {
//     let timer
//     return _ => {
//         clearTimeout(timer)
//         timer = setTimeout(_ => {
//             timer = null
//             fn.apply(this, arguments)
//         }, ms)
//     };
// }

// export const LayoutMaster = ({children}) => {
//     const [isOpen, openMenu, closeMenu] = useMenu(false)
//     const [ fondoNegro, setFondoNegro ] = useState(false)
//     const menuRef = useRef()

//     const toggleContentMenu = (abrirFondoNegro = true) => {
//         // const widthActual = menuRef.current.style.width
//         const dashboard  = document.querySelector('.dashboard');
//         const iconSplit = document.querySelector('#icon-split');

//         if (!isOpen) {
//             menuRef.current.parentNode.style.width = '300px'
//             menuRef.current.style.width = '285px'
//             setTimeout(() => {
//                 dashboard.style.gridTemplateColumns = '300px 1fr 1fr';
//             }, 400)
//             iconSplit.style.transform = 'rotate(0deg)'
//             openMenu()
//             setFondoNegro(abrirFondoNegro)
//         } else {
//             menuRef.current.parentNode.style.width = '15px'
//             menuRef.current.style.width = '0px'
//             dashboard.style.gridTemplateColumns = '15px 1fr 1fr';
//             iconSplit.style.transform = 'rotate(180deg)'
//             closeMenu()
//             setFondoNegro(false)
//         }
//     }

//     // useEffect(() => {
//     //     const debouncedHandleResize = debounce(function handleResize() {
//     //         const split = document.querySelector('#split');

//     //         if (window.innerWidth >= 1024) {
//     //             closeMenu()
//     //             split.style.display = ''
//     //         } else {
//     //             split.style.display = 'none'
//     //         }
//     //     }, 100)

//     //     window.addEventListener('resize', debouncedHandleResize)
//     //     toggleContentMenu(false)

//     //     return _ => {
//     //         window.removeEventListener('resize', debouncedHandleResize)
        
//     //     }
//     // })

//     return (
//         <>
//             <div className="dashboard dark:text-white">
//                 <Header openMenu={toggleContentMenu}></Header>
//                 <Menu ref={menuRef} isOpen={isOpen} openMenu={openMenu} closeMenu={closeMenu} toggleContentMenu={toggleContentMenu}></Menu>
//                 <div className="main overflow-auto">
//                     <div className="w-[95%] mx-auto h-full pt-2 pb-4">
//                         {children}
//                     </div>
//                 </div>
//                 <Footer></Footer>
//                 <div onClick={toggleContentMenu} className={`fondo-negro ${fondoNegro ? '' : 'hidden'}`}></div>
//             </div>
//         </>
//     )
// }