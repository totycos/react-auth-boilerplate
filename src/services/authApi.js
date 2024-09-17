// REGISTER FETCH
export const registerFetch = async (email, password) => {
    try {
        const data = {
            user: {
                email: email,
                password: password
            }
        };
        const response = await fetch('http://localhost:3000/api/v1/users', { // SET APPROPRIATE URL
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Register failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error;
    }
}

// LOGIN FETCH 
export const loginFetch = async (email, password) => {
    try {
        const data = { // ADAPTER LES BODY A TRANSMETTRE A L'API
            user: {
                email: email,
                password: password
            }
        };

        const response = await fetch('http://localhost:3000/api/v1/users/sign_in', { // SET APPROPRIATE URL
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error
    }
}

// FORGOT PASSWORD FETCH 
export const forgotPasswordFetch = async (email) => {
    try {
        const data = {
            user: {
                email: email
            }
        };

        const response = await fetch('http://localhost:3000/api/v1/users/password', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Forgot password failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {
        return error
    }
}

// RESET PASSWORD FETCH 
export const resetPasswordFetch = async (token, password, password_confirmation) => {
    try {
        const data = {
            user: {
                reset_password_token: token,
                password: password,
                password_confirmation: password_confirmation
            }
        };
        console.log('data:', JSON.stringify(data))
        const response = await fetch('http://localhost:3000/api/v1/users/password', {
            //mode: 'no-cors',
            method: 'PATCH', // MAJUSCULE !!!
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Reset password failed. Please check your credentials and try again.');
        }

        return response
    } catch (error) {

        return error
    }
}

