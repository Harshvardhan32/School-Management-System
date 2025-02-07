exports.resetPasswordEmail = (resetLink) => {
    return `<!DOCTYPE html>
        <html lang="en">
    
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
    
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
                }
            
                .logo {
                    padding: 10px 20px;
                    background-color: #FFD60A;
                    border-radius: 10px;
                    max-width: 200px;
                    margin-bottom: 20px;
                }
            
                .message {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
            
                .body {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
            
                .cta {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #51DFC3;
                    color: #000000;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                }
            
                .support {
                    font-size: 14px;
                    color: #999999;
                    margin-top: 20px;
                }
            
                .highlight {
                    font-weight: bold;
                }
            </style>
        </head>
            
        <body>
            <div class="container">
                <div class="message">Reset Your Password</div>
                <div class="body">
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <a class="cta" href="${resetLink}" target="_blank">Reset Password</a>
                    <p>If you did not request this password reset, you can safely ignore this email.</p>
                    <p>For security reasons, this link will expire in 10 minutes.</p>
                </div>
                <div class="support">If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:support@abcdschool.com">support@abcdschool.com</a>. We are here to help!</div>
            </div>
        </body>
            
        </html>`;
};