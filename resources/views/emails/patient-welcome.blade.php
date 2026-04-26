<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to DCM Dental Chamber</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }

        .content {
            background: #ffffff;
            padding: 30px;
            border-left: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
        }

        .greeting {
            font-size: 18px;
            color: #1e3c72;
            margin-bottom: 20px;
        }

        .patient-details {
            background: #f0f7ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2a5298;
        }

        .patient-details h3 {
            margin: 0 0 15px 0;
            color: #1e3c72;
        }

        .patient-details p {
            margin: 8px 0;
        }

        .message-box {
            background: #fff8e1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }

        .message-box p {
            margin: 0;
            font-size: 16px;
        }

        .dental-icon {
            font-size: 48px;
            text-align: center;
            margin: 20px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }

        .footer {
            background: #f4f7fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }

        .social-links {
            margin-top: 15px;
        }

        .social-links a {
            color: #2a5298;
            text-decoration: none;
            margin: 0 10px;
        }

        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }

            .content {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🦷 DCM Dental Chamber</h1>
            <p>Your Smile, Our Priority</p>
        </div>

        <div class="content">
            <div class="dental-icon">
                😁🦷😊
            </div>

            @if ($action === 'created')
                <div class="greeting">
                    <strong>Dear {{ $patient->name }},</strong>
                </div>

                <p>Thank you for choosing <strong>DCM Dental Chamber</strong> for your dental care needs! We are
                    delighted to welcome you to our family.</p>

                <div class="message-box">
                    <p>🎉 <strong>Welcome to DCM Dental Chamber!</strong> 🎉</p>
                    <p style="margin-top: 10px;">Your journey to a healthy smile begins here!</p>
                </div>
            @else
                <div class="greeting">
                    <strong>Dear {{ $patient->name }},</strong>
                </div>

                <p>Your patient profile at <strong>DCM Dental Chamber</strong> has been successfully updated.</p>

                <div class="message-box">
                    <p>✅ <strong>Profile Updated Successfully!</strong> ✅</p>
                    <p style="margin-top: 10px;">Your information has been updated in our system.</p>
                </div>
            @endif

            <div class="patient-details">
                <h3>📋 Patient Information</h3>
                <p><strong>Patient ID:</strong> {{ $patient->patient_uid }}</p>
                <p><strong>Full Name:</strong> {{ $patient->name }}</p>
                <p><strong>Phone:</strong> {{ $patient->phone_primary }}</p>
                @if ($patient->email)
                    <p><strong>Email:</strong> {{ $patient->email }}</p>
                @endif
                <p><strong>Registration Date:</strong> {{ date('F j, Y', strtotime($patient->registration_date)) }}</p>
            </div>

            <h3>✨ What We Offer:</h3>
            <ul>
                <li>🦷 Professional Dental Checkups</li>
                <li>✨ Teeth Whitening Services</li>
                <li>🦷 Root Canal Treatment</li>
                <li>✨ Dental Implants</li>
                <li>🦷 Orthodontic Treatment (Braces)</li>
                <li>✨ Emergency Dental Care</li>
            </ul>

            <center>
                <a href="{{ route('patients.show', $patient->id) }}" class="button">View Your Profile</a>
            </center>

            <p>If you have any questions or need to schedule an appointment, please don't hesitate to contact us:</p>
            <p>📞 Phone: +880 1234 567890<br>
                ✉️ Email: info@dcmdental.com<br>
                📍 Address: Your Dental Chamber Address Here</p>

            <p style="margin-top: 20px;">Best regards,<br>
                <strong>DCM Dental Chamber Team</strong><br>
                <em>Your Smile, Our Passion</em>
            </p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} DCM Dental Chamber. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
            <div class="social-links">
                <a href="#">Facebook</a> |
                <a href="#">Instagram</a> |
                <a href="#">Twitter</a>
            </div>
        </div>
    </div>
</body>

</html>
