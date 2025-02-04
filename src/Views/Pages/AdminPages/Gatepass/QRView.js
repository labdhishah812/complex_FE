import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { QRCodeCanvas } from 'qrcode.react';

const QRView = () => {
    const { encodedData } = useParams();
    console.log(encodedData,"encodedData")
    try {
        // Decode the data from base64
        const decodedData = JSON.parse(atob(encodedData));

        return (
            <div className="flex justify-content-center align-items-center min-h-screen p-4">
                <Card className="w-full md:w-6 lg:w-4">
                    <div className="flex flex-column align-items-center">
                        <QRCodeCanvas
                            value={JSON.stringify(decodedData)}
                            size={250}
                            level="H"
                        />
                    </div>
                </Card>
            </div>
        );
    } catch (error) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen p-4">
                <Card className="w-full md:w-6 lg:w-4">
                    <div className="text-center">
                        Invalid QR code data
                    </div>
                </Card>
            </div>
        );
    }
};

export default QRView;
