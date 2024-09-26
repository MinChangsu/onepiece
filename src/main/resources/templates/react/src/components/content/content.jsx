import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSettings } from '../../config/app-settings';
import PageWithFooter from "../footer/footer";
import PerfectScrollbar from "react-perfect-scrollbar";

function Content() {
	return (
		<AppSettings.Consumer>
			{({appContentClass}) => (<>
				<div className={'app-content'+ appContentClass} style={{backgroundImage:'url(/assets/img/cmm/bodyline.png), url(/assets/img/cmm/bodybg.png)',backgroundSize: 'cover, cover'}}>
					<div className="h-100 d-flex flex-column">
					<PerfectScrollbar className="app-content-padding flex-grow-1 overflow-hidden" options={{ suppressScrollX: true }}>
						<Outlet/>
					</PerfectScrollbar>

					</div>
					{/*<PageWithFooter/>*/}

				</div>
				<PageWithFooter/>
					</>
			)
			}
		</AppSettings.Consumer>
	)
}

export default Content;
