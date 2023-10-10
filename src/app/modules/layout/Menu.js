import React, { useRef, useEffect, useContext } from 'react';
import {NavLink,useHistory} from "react-router-dom";
import $ from 'jquery';
import { UserContext } from '../../../context/provider/UserProvider';

export const Menu = React.forwardRef(({isOpen, openMenu, closeMenu, toggleContentMenu}, ref) => {    
    const { stateUser } = useContext(UserContext)
    const splitRef = useRef();
    useEffect(() => {
        const li = document.getElementsByClassName("li-nav-div")
        for (var i = 0; i < li.length; i++) {
            const linkSubMenu = li[i].parentNode.querySelectorAll('.li-a-submenu')
            
            let up = true

            for (var j = 0; j < linkSubMenu.length; j++) {
                const ulSubMenu = linkSubMenu[j].parentNode.parentNode.parentNode
    
                if (linkSubMenu[j].classList.contains("active")) {
                    const liNavDiv = ulSubMenu.parentNode;
                    liNavDiv.querySelector('.li-nav-div').children[0].classList.add("active")
                    up = false
                }
            }

            if(up) $(li[i]).parent().children('ul').slideUp();
        }

    })

    const toggleMenu = (e) => {
        let element = e.target

        while (!element.classList.contains('li-nav-div')) {
            element = element.parentNode
        }

        const menuParents = $('.li-nav-div')
        for (let i = 0; i < menuParents.length; i++) {
            const menuParent = menuParents[i]
            if (element != menuParent) {
                menuParent.children[0].classList.remove('active')
                $(menuParent.parentNode.children[1]).slideUp()
            }
        }

        if (element.children[0].classList.contains('active')) {
            $(element.parentNode.querySelector('.ul-submenu')).slideUp();
        } else {
            $(element.parentNode.querySelector('.ul-submenu')).slideDown();
        }

        element.children[0].classList.toggle('active')
    }
    const cerrarMenu = () =>{
        toggleContentMenu(false)
    }

    return (
        <>
            <div className={`flex menu dark:text-white lg:absolute relative h-full w-[300px] ${isOpen ? 'active' : ''}`}>
                <ul ref={ref} className="ul-nav lg:py-[20px] py-0 bg-[#272727]">
                    {
                        stateUser.menus.map(m => {
                            const menuHijos = stateUser.menus.filter(mh => mh.codMenuPadre == m.codMenu && mh.codMenu != m.codMenu);
                            if (m.codMenu === m.codMenuPadre) {
                                return (
                                    <li id="li" key={m.codMenu} className="waves-effect ul-nav-li active-li">
                                        <div className="li-nav-div" onClick={(e) => toggleMenu(e)}>
                                            <a className="nav-link li-a">
                                                <div className="w-full flex justify-between">
                                                    <span className="text-menu">{m.nomMenu}</span>
                                                    <i className="icon-menu fas fa-sort-down"></i>
                                                </div>
                                            </a>
                                        </div>
                                        <ul className="ul-submenu" style={{padding: 0}}>
                                            {
                                                menuHijos.map(mh => {
                                                    return (
                                                        <li key={mh.codMenu} id="li-submenu" className="waves-effect ul-nav-li-submenu">
                                                            <div className="li-nav-div-submenu">
                                                                <NavLink to={mh.urlMenu} className="nav-link li-a-submenu" onClick={() => cerrarMenu()}>
                                                                    <span className="text-sub-menu">{mh.nomMenu}</span>
                                                                </NavLink>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>  
                                )
                            }
                        }) 
                    }
                </ul>
                <div ref={splitRef} id="split" onClick={() => toggleContentMenu(false)} onBlur={console.log('Onblur')} className="flex items-center lg:hidden justify-center w-[15px] bg-[#47596c] hover:bg-[#3b4a5a] cursor-pointer">
                    <i id="icon-split" className="icon-split fas fa-caret-square-left text-[12px]"></i>
                </div>
            </div>
        </>
    )
})