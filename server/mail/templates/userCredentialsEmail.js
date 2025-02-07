exports.userCredentialsEmail = (schoolName, name, email, userId, password, loginUrl, supportEmail) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Welcome to ${schoolName}</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                border: 1px solid #dddddd;
                border-radius: 8px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
    
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 15px;
                border-radius: 8px 8px 0 0;
                font-size: 24px;
                font-weight: bold;
            }
    
            .body {
                text-align: left;
                padding: 20px;
                font-size: 16px;
            }
    
            .credentials {
                background-color: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
                margin: 20px 0;
                border-left: 4px solid #4CAF50;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #999999;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">Welcome to ${schoolName}</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>We are delighted to welcome you to ${schoolName}. Below are your login credentials for accessing your account:</p>
                <div class="credentials">
                    <p><strong>Email: </strong> ${email}</p>
                    <p><strong>User ID: </strong> ${userId}</p>
                    <p><strong>Password: </strong> ${password}</p>
                </div>
                <p>To log in, please visit: <a href="${loginUrl}" target="_blank">${loginUrl}</a></p>
                <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
            </div>
            <div class="footer">
                <p>Please keep your login credentials secure and do not share them with anyone.</p>
            </div>
        </div>
    </body>
    
    </html>`;
};