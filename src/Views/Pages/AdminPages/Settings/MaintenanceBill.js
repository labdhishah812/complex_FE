import { useParams } from 'react-router-dom';
import components from '../..';
import axios from 'axios';
// import { Worker } from '@react-pdf-viewer/core';
// import { Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
const MaintenanceBill = () => {
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
            axios({
                url: `${BASE_URL_API}/maintenance/maitenance_bill/receipt`,
                method: 'POST', // Change to POST
                responseType: 'blob', // Important to handle binary data
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    Authorization: token
                },
                data: {
                    // Include any data you need to send with the POST request
                    maintainance_id: params?.id
                    // Add more key-value pairs as needed
                }
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }).catch((error) => {
                console.error('Error downloading the file:', error);
            });
            // const { data } = await axios.post(`${BASE_URL_API}/maintenance/maitenance_bill/receipt`, { maintainance_id: params?.id }, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Origin': '*',
            //         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            //         Authorization: token
            //     }
            // });
            // console.log(data, "datadatadatadatadata");
            // if (data) {
            //     const blob = new Blob([data], { type: 'application/json' });
            //     const url = URL.createObjectURL(blob);
            //     console.log(url);

            //     setCart(url);

            // }
            // const binaryStringToBuffer = (str) => {
            //     const buffer = new ArrayBuffer(str.length);
            //     const view = new Uint8Array(buffer);
            //     for (let i = 0; i < str.length; i++) {
            //         view[i] = str.charCodeAt(i) & 0xff;
            //     }
            //     return buffer;
            // };

            // // Convert PDF data to ArrayBuffer
            // const pdfBuffer = binaryStringToBuffer(data);

            // // Create a Blob from the ArrayBuffer
            // const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

            // // Create a URL for the Blob
            // const url = URL.createObjectURL(blob);

            // // Trigger the download
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'file.pdf');
            // document.body.appendChild(link);
            // link.click();

            // // Clean up
            // document.body.removeChild(link);
            // URL.revokeObjectURL(url);


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
        {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            {uiCart && <Viewer fileUrl={uiCart} plugins={[defaultLayoutPluginInstance]} />}
        </Worker> */}
        {/* <div ref={printRef} dangerouslySetInnerHTML={{ __html: uiCart }} /> */}
        {/* <div className="button_print">
            <button className="print-button" onClick={printAndHide}>Print</button>
        </div> */}
        {/* <div onClick={() => printAndHide()}>safadfdaf</div> */}
    </div>
    )
}
export default MaintenanceBill;