import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import jsPDF from 'jspdf';
import logoImage from '../../../../assets/images/Complex360-02.svg';

const QRModal = ({ visible, onHide, gatepassData }) => {
    const [shareableLink, setShareableLink] = useState('');
    const toastRef = useRef(null);

    useEffect(() => {
        if (gatepassData && gatepassData._id) {
            const baseUrl = window.location.origin;
            setShareableLink(`${baseUrl}/gatepass/${gatepassData._id}`);
        }
    }, [gatepassData]);

    // const downloadQRPDF = () => {
    //     if (!gatepassData) return;

    //     const doc = new jsPDF();
    //     const canvas = document.getElementById('gatepass-qr');
    //     const qrImage = canvas.toDataURL('image/png');

    //     doc.addImage(qrImage, 'PNG', 15, 15, 50, 50);
    //     doc.setFontSize(16);
    //     doc.text('Gate Pass Details', 75, 25);

    //     doc.setFontSize(12);
    //     doc.text(`Name: ${gatepassData.name || '-'}`, 75, 40);
    //     doc.text(`Email: ${gatepassData.email || '-'}`, 75, 50);
    //     doc.text(`Visitor Type: ${gatepassData.visitor_type || '-'}`, 75, 60);
    //     doc.text(`Valid From: ${gatepassData.valid_from || '-'}`, 75, 70);
    //     doc.text(`Valid To: ${gatepassData.valid_to || '-'}`, 75, 80);
    //     doc.text(`Purpose: ${gatepassData.purpose || '-'}`, 75, 90);

    //     doc.save(`gatepass-${gatepassData._id}.pdf`);
    // };

    const downloadQRPDF = () => {
        if (!gatepassData) return;

        // Create new PDF document
        const doc = new jsPDF('p', 'mm', 'a4');

        // Get QR code from canvas
        const canvas = document.getElementById('gatepass-qr');
        const qrImage = canvas.toDataURL('image/png');

        // Convert SVG to image data
        const img = new Image();
        img.src = logoImage;

        img.onload = () => {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const logoDataUrl = canvas.toDataURL('image/png');

            // Add green header
            doc.setFillColor(0, 188, 115);
            doc.rect(0, 0, 210, 20, 'F');

            // Add logo
            doc.addImage(logoDataUrl, 'PNG', 3, 9,50, 8);

            // Header text
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('Digital Gate Pass', 105, 15, { align: 'center' });

            // Add QR code
            const qrXPosition = (210 - 60) / 2;
            doc.addImage(qrImage, 'PNG', qrXPosition, 35, 60, 60);

            // Pass Details heading
            doc.setTextColor(0, 188, 115);
            doc.setFontSize(14);
            doc.text('Gate Pass Details', 15, 110);
            doc.line(15, 112, 195, 112);

            // Details content
            const details = [
                { label: 'Visitor Name', value: gatepassData.name || '-' },
                { label: 'Email', value: gatepassData.email || '-' },
                { label: 'Visitor Type', value: gatepassData.visitor_type || '-' },
                { label: 'Valid From', value: gatepassData.valid_from || '-' },
                { label: 'Valid To', value: gatepassData.valid_to || '-' }
            ];

            let yPosition = 125;
            details.forEach((detail, index) => {
                // Light background for alternate rows
                if (index % 2 === 0) {
                    doc.setFillColor(245, 247, 250);
                    doc.rect(15, yPosition - 5, 180, 12, 'F');
                }

                doc.setTextColor(0, 188, 115);
                doc.setFontSize(12);
                doc.text(detail.label, 15, yPosition);

                doc.setTextColor(0, 0, 0);
                doc.text(detail.value, 80, yPosition);

                yPosition += 20;
            });

            // Footer
            doc.setFillColor(0, 188, 115);
            doc.rect(0, 277, 210, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text('© 2024 Complex360 | All Rights Reserved', 105, 287, { align: 'center' });
            doc.text('Technology Partner: ThinkTanker', 105, 292, { align: 'center' });

            // Save the PDF
            doc.save(`gatepass-${gatepassData._id}.pdf`);
        };
    };
    useEffect(() => {
        if (gatepassData) {
            // Encode the data in base64
            const encodedData = btoa(JSON.stringify(gatepassData));
            const baseUrl = window.location.origin;
            setShareableLink(`${baseUrl}/gatepass/view-qr/${encodedData}`);
        }
    }, [gatepassData]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            toastRef.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Link copied to clipboard!',
                life: 3000
            });
        } catch (err) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to copy link',
                life: 3000
            });
        }
    };
    if (!gatepassData) return null;
    return (
        <>
            <Toast ref={toastRef} />
            <Dialog
                visible={visible}
                onHide={onHide}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-id-card text-2xl text-primary"></i>
                        <span className="font-bold text-xl">Digital Gate Pass</span>
                    </div>
                }
                className="w-full md:w-8 lg:w-6"
                modal
                closeIcon={<i className="pi pi-times text-500 text-xl"></i>}
            >
                <div className="flex flex-column align-items-center p-4">
                    {/* QR Code Section */}
                    <Card className="w-full mb-4 shadow-2 border-round">
                        <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-4">
                            <div className="flex flex-column align-items-center">
                                <div className="surface-card p-4 border-round shadow-2">
                                    <QRCodeCanvas
                                        id="gatepass-qr"
                                        value={JSON.stringify({
                                            id: gatepassData._id,
                                            name: gatepassData.name,
                                            email: gatepassData.email,
                                            visitorType: gatepassData.visitor_type,
                                            validFrom: gatepassData.valid_from,
                                            validTo: gatepassData.valid_to
                                        })}
                                        size={200}
                                        level="H"
                                    />
                                </div>
                                <small className="text-500 mt-2">Scan to verify gate pass</small>
                            </div>

                            {/* Pass Details */}
                            <div className="flex flex-column gap-3 flex-1">
                                <div className="text-xl font-bold text-900 mb-2">Pass Details</div>
                                <div className="flex flex-column gap-2">
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-user text-primary"></i>
                                        <div>
                                            <div className="text-500 text-sm">Visitor Name</div>
                                            <div className="text-900">{gatepassData.name || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-envelope text-primary"></i>
                                        <div>
                                            <div className="text-500 text-sm">Email</div>
                                            <div className="text-900">
                                                {gatepassData.email ? (
                                                    <a href={`mailto:${gatepassData.email}`} className="text-blue-500 hover:text-blue-700 no-underline">
                                                        {gatepassData.email}
                                                    </a>
                                                ) : '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-tag text-primary"></i>
                                        <div>
                                            <div className="text-500 text-sm">Visitor Type</div>
                                            <div className="text-900">{gatepassData.visitor_type || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-calendar text-primary"></i>
                                        <div>
                                            <div className="text-500 text-sm">Valid Period</div>
                                            <div className="text-900">
                                                {gatepassData.valid_from || '-'} to {gatepassData.valid_to || '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-info-circle text-primary"></i>
                                        <div>
                                            <div className="text-500 text-sm">Purpose</div>
                                            <div className="text-900">{gatepassData.purpose || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Sharing Section */}
                    {/* <Card className="w-full mb-4 shadow-2 border-round">
                        <div className="flex flex-column gap-3">
                            <div className="text-xl font-bold text-900">Share Gate Pass</div>
                            <div className="p-inputgroup">
                                <InputText
                                    value={shareableLink}
                                    readOnly
                                    className="w-full"
                                />
                                <Button
                                    icon="pi pi-copy"
                                    onClick={copyToClipboard}
                                    tooltip="Copy Link"
                                />
                            </div>
                        </div>
                    </Card> */}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-content-center">
                        <Button
                            label="Download QR"
                            icon="pi pi-download"
                            className="p-button-raised"
                            onClick={downloadQRPDF}
                        />
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            className="p-button-raised p-button-secondary"
                            onClick={onHide}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default QRModal;
