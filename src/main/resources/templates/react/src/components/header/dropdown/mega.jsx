import React from 'react';
import {LinkProps} from "react-router-dom";
import Menu from "../../../config/app-menu";

function DropdownMegaMenu(){
	return (
		<div className="collapse d-md-block me-auto" id="top-navbar">
			<div className="navbar-nav" style={{height:'100%'}}>
				{Menu.map((item, index) => (
					<div className="navBox d-flex align-items-center" style={{height:'100%'}}>
						<div key={index} className="navbar-item align-items-center justify-content-center" >
							<a href={item.path} className="navbar-link d-flex align-items-center">
								<span style={{fontSize:'1.1rem',fontWeight:'bold'}}>{item.title}</span>
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
			);
			}

			export default DropdownMegaMenu;
