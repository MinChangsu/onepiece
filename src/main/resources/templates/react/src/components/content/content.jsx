import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSettings } from '../../config/app-settings';
import PageWithFooter from "../footer/footer";
import PerfectScrollbar from "react-perfect-scrollbar";

function Content() {
	return (
		<AppSettings.Consumer>
			{({appContentClass}) => (
				<div className={'app-content'+ appContentClass}>
					{/*<div className="h-100 d-flex flex-column">*/}
					{/*<PerfectScrollbar className="app-content-padding flex-grow-1 overflow-hidden" options={{ suppressScrollX: true }}>*/}
						<Outlet/>
					{/*</PerfectScrollbar>*/}
						{/*<PageWithFooter/>*/}
					{/*</div>*/}
				</div>
			)
			}
		</AppSettings.Consumer>
	)
}

export default Content;
