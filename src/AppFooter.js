// import React, { useContext, useState } from 'react';
// import { classNames } from 'primereact/utils';
// import { Button } from 'primereact/button';
// import { RTLContext } from './App';

// const AppFooter = (props) => {
//     const isRTL = useContext(RTLContext);
//     const [year, setYear] = useState(new Date().getFullYear());

//     return (
//         <div className="layout-footer flex align-items-center p-2 shadow-2 justify-content-end">
//             <p style={{ color: '#6c757d' }}>{year} © Complex360 | All Rights Reserved | Technology Partner <a href='https://www.thinktanker.io/'><b>ThinkTanker</b></a></p>
//             {/* <img id="footer-logo" src={`assets/layout/images/footer-${props.colorMode === 'light' ? 'ultima' : 'ultima-dark'}.svg`} alt="ultima-footer-logo" /> */}
//             {/* <Button type="button" icon="pi pi-github fs-large" className={classNames('p-button-rounded p-button-text p-button-plain', { 'ml-auto mr-2': !isRTL, 'ml-2 mr-auto': isRTL })}></Button> */}
//             {/* <Button type="button" icon="pi pi-facebook fs-large" className={classNames('p-button-rounded p-button-text p-button-plain', { 'mr-2': !isRTL, 'ml-2': isRTL })}></Button> */}
//             {/* <Button type="button" icon="pi pi-twitter fs-large" className={classNames('p-button-rounded p-button-text p-button-plain', { 'mr-2': !isRTL, 'ml-2': isRTL })}></Button> */}
//         </div>
//     );
// };

// export default AppFooter;


import React, { useContext, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { RTLContext } from './App';

const AppFooter = (props) => {
    const isRTL = useContext(RTLContext);
    const [year, setYear] = useState(new Date().getFullYear());

    return (
        <div className="layout-footer flex align-items-center p-2 shadow-2 justify-content-end">
            <p style={{ color: '#6c757d' }}>
                {year} © Complex360 | All Rights Reserved | Technology Partner <a href='https://www.thinktanker.io/' target="_blank" rel="noopener noreferrer"><b>ThinkTanker</b></a>
            </p>
        </div>
    );
};

export default AppFooter;
