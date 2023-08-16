import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';

function GGlogin() {
    const responseGoogle = (response: any) => {
        console.log(1);
        const user = response.googleId;
        console.log('reponse ne:',user);
    // Xử lý phản hồi của Google sau khi đăng nhập thành công
    };

    const responseGooglefail = (response: any) => {
        console.log(2);
        const user = response.googleId;
        console.log('reponse ne:',user);
    // Xử lý phản hồi của Google sau khi đăng nhập thành công
    };

    return (
        <div>
            <GoogleLogin
                clientId="282044461413-0op0lef391ueoau646k81au1m7n3o8ee.apps.googleusercontent.com"
                onSuccess={responseGoogle}
                onFailure={responseGooglefail}
                cookiePolicy={'single_host_origin'}
                buttonText='Google'
                isSignedIn={true}
            />
        </div>
    );
}

export default GGlogin;