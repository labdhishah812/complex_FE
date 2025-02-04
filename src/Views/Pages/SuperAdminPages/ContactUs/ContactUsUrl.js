import React from 'react';
import { Card } from 'primereact/card';

const ContactUs = () => {
    return (
        <>
            <Card title="Privacy Policy" subTitle="Last updated: August 2024" className="p-shadow-4">
                <p>
                    <strong>1. Introduction</strong>
                </p>
                <p>Welcome to our Privacy Policy page. We are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>

                <p>
                    <strong>2. Information We Collect</strong>
                </p>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>

                <p>
                    <strong>3. How We Use Your Information</strong>
                </p>
                <p>We use your information to provide, maintain, and improve our services. This includes processing transactions, sending updates, and personalizing your experience.</p>

                <p>
                    <strong>4. How We Protect Your Information</strong>
                </p>
                <p>We implement security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

                <p>
                    <strong>5. Your Rights</strong>
                </p>
                <p>You have the right to access, update, or delete your personal information. You can also object to certain processing activities.</p>

                <p>
                    <strong>6. Changes to This Privacy Policy</strong>
                </p>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                <p>
                    <strong>7. Contact Us</strong>
                </p>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@example.com">support@example.com</a>.
                </p>
            </Card>
        </>
    );
};

export default ContactUs;
