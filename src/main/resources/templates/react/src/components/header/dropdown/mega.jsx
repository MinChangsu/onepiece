import React from 'react';
import {LinkProps, NavLink} from "react-router-dom";
import Menu from "../../../config/app-menu";

function DropdownMegaMenu(){
	return (
		<div className="collapse d-md-block me-auto" id="top-navbar">
			<div className="navbar-nav" style={{height:'100%'}}>
				{Menu.map((item, index) => (
					<div key={index} className="navBox d-flex align-items-center" style={{height:'100%'}}>
						<div  className="navbar-item align-items-center justify-content-center" >
							<NavLink to={item.path} className="navbar-link d-flex align-items-center">
								<span style={{fontSize:'1.1rem',fontWeight:'bold'}}>{item.title}</span>
							</NavLink>
						</div>
					</div>
				))}
			</div>
		</div>
			);
			}

export default DropdownMegaMenu;
