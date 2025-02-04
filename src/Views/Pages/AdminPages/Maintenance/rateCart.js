import { useParams } from 'react-router-dom';
import components from '../..';
import axios from 'axios';
const RateCart = () => {
    const { useEffect, useState, React, useNavigate, useDispatch, useSelector, useRef } = components;
    const [uiCart, setCart] = useState(null)
    const params = useParams();
    const printRef = useRef(null);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    useEffect(() => {
        if (params?.id) {
            callApi()
        }
    }, [params.id])
    const callApi = async () => {
        try {

            const { data } = await axios.post(`${BASE_URL_API}/maintenance/maintenance_rate_card/single_user`, { property_assign_id: params?.id }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    Authorization: token
                }
            });
            setCart(data?.data);

            //     const script = document.createElement('script');
            //     script.innerHTML = `
            //           function printAndHide() {
            //             document.querySelector('.button_print').classList.add('hidden');
            //            setTimeout(() => {
            //   window.print();
            // }, 5000);
            //           }
            //         `;
            //     document.body.appendChild(script);
            //     return () => {
            //         document.body.removeChild(script);
            //     };

        } catch (error) {
            console.log(error);

        }
    }
    const printAndHide = () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print</title>
                    <style>
                        // body {
                        //     font-family: 'Open Sans', sans-serif;
                        //     margin: 0;
                        //     padding: 0;
                        //     background-color: #f4f4f4;
                        // }
                        // .container {
                        //     max-width: 800px;
                        //     margin: 0 auto;
                        //     background-color: #fff;
                        //     padding: 30px;
                        //     box-shadow: none;
                        // }
                        // h1, h2, h3 {
                        //     text-align: center;
                        // }
                        // table {
                        //     width: 100%;
                        //     border-collapse: collapse;
                        //     margin: 20px 0;
                        // }
                        // th, td {
                        //     // border: 1px solid #ddd;
                        //     padding: 10px;
                        //     text-align: center;
                        // }
                        .print-button {
                            display: none; /* Hide the print button in the print version */
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${printContents}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close(); // Ensure the document is fully written
            printWindow.focus(); // Focus on the window to ensure it's ready
            printWindow.print();
            printWindow.close();
        }
    };
    // const printAndHide = () => {
    //     // Hide the print button
    //     document.querySelector('.button_print').classList.add('hidden');

    //     // Print only the content inside the ref
    //     if (printRef.current) {
    //         const printContents = printRef.current.innerHTML;
    //         const originalContents = document.body.innerHTML;

    //         document.body.innerHTML = printContents;
    //         window.print();
    //         document.body.innerHTML = originalContents;
    //         window.location.reload(); // Reload to reset the original content
    //     }
    // };
    // const printAndHide = () => {
    //     document.querySelector('.button_print').classList.add('hidden');
    //     window.print();
    // };
    return (<div className='h-full'>
        <div ref={printRef} dangerouslySetInnerHTML={{ __html: uiCart }} />
        <div className="button_print">
            <button className="print-button" onClick={printAndHide}>Print</button>
        </div>
        {/* <div onClick={() => printAndHide()}>safadfdaf</div> */}
    </div>
    )
}
export default RateCart;