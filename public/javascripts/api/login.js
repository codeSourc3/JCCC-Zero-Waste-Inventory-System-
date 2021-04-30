const API_PATH = '/api/v1';

const login = async (username, password) => {
    const loginRoute = `${API_PATH}/auth/login`;
    const response = await fetch(loginRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({username, password})
    });
    const {accessToken, refreshToken} = await response.json();
    window.sessionStorage.setItem('jwt', accessToken);
    window.localStorage.setItem('refresh_token', refreshToken);
    return accessToken;
};

async function toDashboard() {
    const token = await login('ejmayo', 'programming');
    const response = await fetch('/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.dir(response);
}
toDashboard();